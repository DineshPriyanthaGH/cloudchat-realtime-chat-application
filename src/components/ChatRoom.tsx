import React, { useEffect, useRef, useState } from "react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebaseConfig";
import { Button } from "./ui/button";
import EmojiPicker from "emoji-picker-react";
import { useToast } from "../hooks/use-toast";
import { 
  User,
  Phone,
  Video,
  MoreVertical,
  Smile,
  Paperclip,
  Send,
  Mic
} from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: string;
  uid: string;
  createdAt: any;
  imageUrl?: string;
}

interface ChatRoomProps {
  chatId?: string;
  selectedUser?: {
    uid?: string;
    displayName?: string;
    email?: string;
    isOnline?: boolean;
    lastSeen?: any;
    photoURL?: string;
    about?: string;
  };
}

const ChatRoom: React.FC<ChatRoomProps> = ({ chatId = "global", selectedUser }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const auth = getAuth();
  const user = auth.currentUser;
  const { toast } = useToast();

  const IMGBB_API_KEY = "c4bd8b311663c2f4272903a9700ff82e";

  const uploadImageToImgbb = async (file: File): Promise<string> => {
    try {
      console.log("Starting image upload...", file.name, file.size);
      const formData = new FormData();
      formData.append("image", file);
      
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: "POST",
        body: formData,
      });
      
      const data = await res.json();
      console.log("Upload response:", data);
      
      if (data.success) {
        console.log("Upload successful:", data.data.url);
        return data.data.url;
      } else {
        console.error("Upload failed:", data);
        throw new Error(data.error?.message || "Image upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  useEffect(() => {
    const q = query(collection(db, "chats", chatId, "messages"), orderBy("createdAt", "asc"));
    let isFirstLoad = true;
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs: Message[] = [];
      querySnapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...(doc.data() as any) });
      });
      
      // Check for new messages (only after initial load)
      if (!isFirstLoad && user) {
        querySnapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const newMsg = { id: change.doc.id, ...change.doc.data() } as Message;
            
            // Don't notify for own messages
            if (newMsg.uid !== user.uid) {
              // Show toast notification
              toast({
                title: `New message from ${newMsg.sender}`,
                description: newMsg.text || (newMsg.imageUrl ? "📷 Sent an image" : ""),
                variant: "default",
              });

              // Play notification sound
              try {
                const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmASBTR6x/DcjT4IDVyz6eas');
                audio.volume = 0.1;
                audio.play().catch(() => {
                  // Fallback for browsers that don't allow audio without user interaction
                  console.log('🔔 New message notification');
                });
              } catch (error) {
                console.log('🔔 New message notification');
              }

              // Browser notification (if permission granted)
              if ('Notification' in window && Notification.permission === 'granted') {
                new Notification(`New message from ${newMsg.sender}`, {
                  body: newMsg.text || "📷 Sent an image",
                  icon: '/favicon.svg',
                  tag: `message-${newMsg.id}`,
                });
              } else if ('Notification' in window && Notification.permission === 'default') {
                // Request permission
                Notification.requestPermission();
              }
            }
          }
        });
      }
      
      setMessages(msgs);
      setLoading(false);
      isFirstLoad = false;
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    });
    return unsubscribe;
  }, [chatId, user, toast]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newMessage.trim() && !image) || !user) return;

    setUploading(true);
    let imageUrl: string | null = null;

    try {
      if (image) {
        imageUrl = await uploadImageToImgbb(image);
      }

      await addDoc(collection(db, "chats", chatId, "messages"), {
        text: newMessage || "",
        imageUrl,
        sender: user.displayName || user.email || "Anonymous",
        uid: user.uid,
        createdAt: serverTimestamp(),
      });

      setNewMessage("");
      setImage(null);
      // Reset the file input
      const fileInput = document.getElementById("image-upload") as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      alert("Failed to send message: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Modern Header */}
      <div className="bg-card border-b border-border p-4 flex items-center justify-between">
        <div 
          className="flex items-center space-x-3 cursor-pointer hover:bg-muted/50 rounded-lg p-2 -m-2 transition-colors"
          onClick={() => setShowUserProfile(true)}
        >
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            {selectedUser?.isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-background"></div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-sm">
              {selectedUser?.displayName || selectedUser?.email || "Chat"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {selectedUser?.isOnline ? "Online" : "Last seen recently"}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-muted-foreground text-sm">Loading messages...</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="h-8 w-8 text-white" />
              </div>
              <p className="text-muted-foreground">Start a conversation</p>
              <p className="text-xs text-muted-foreground mt-1">Send a message to get started</p>
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender === (user?.displayName || user?.email);
            return (
              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-xs lg:max-w-md ${isMe ? "order-1" : "order-2"}`}>
                  {!isMe && (
                    <p className="text-xs text-muted-foreground mb-1 px-3">{msg.sender}</p>
                  )}
                  <div className={`rounded-2xl px-4 py-2 ${
                    isMe 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted"
                  }`}>
                    {msg.imageUrl && (
                      <img 
                        src={msg.imageUrl} 
                        alt="Shared image" 
                        className="rounded-lg mb-2 max-w-full cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => window.open(msg.imageUrl, '_blank')}
                      />
                    )}
                    {msg.text && <p className="text-sm leading-relaxed">{msg.text}</p>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 px-3">
                    {msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ""}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

        {/* Modern Input Section */}
        <div className="p-4 bg-card/80 backdrop-blur-sm border-t border-border">
          <form onSubmit={handleSend} className="relative">
            <div className="flex items-center gap-3 bg-muted/50 rounded-2xl p-3 border border-border/50 focus-within:border-primary/50 transition-colors">
              {/* Emoji Picker Button */}
              <button
                type="button"
                onClick={() => setShowEmojiPicker((prev) => !prev)}
                className="flex-shrink-0 p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground hover:text-primary"
                title="Add Emoji"
              >
                <Smile className="h-5 w-5" />
              </button>

              {/* File Upload */}
              <input
                type="file"
                accept="image/*"
                id="image-upload"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setImage(e.target.files[0]);
                  }
                }}
                disabled={uploading}
              />
              <label 
                htmlFor="image-upload" 
                className="flex-shrink-0 p-2 hover:bg-muted rounded-xl transition-colors cursor-pointer text-muted-foreground hover:text-primary" 
                title="Attach image"
              >
                <Paperclip className="h-5 w-5" />
              </label>

              {/* Text Input */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  className="w-full bg-transparent border-none outline-none placeholder-muted-foreground text-foreground text-sm py-2"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(e as any);
                    }
                    if (e.key === 'Escape') {
                      setShowEmojiPicker(false);
                    }
                  }}
                  disabled={!user || uploading}
                  autoComplete="off"
                />
                
                {/* Image preview */}
                {image && (
                  <div className="absolute top-full left-0 mt-2 flex items-center gap-2 bg-muted/80 rounded-lg p-2 text-xs">
                    <span className="text-muted-foreground">{image.name}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setImage(null);
                        const fileInput = document.getElementById("image-upload") as HTMLInputElement;
                        if (fileInput) fileInput.value = "";
                      }}
                      className="text-red-500 hover:text-red-700 ml-1"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              {/* Voice Message Button */}
              <button
                type="button"
                className="flex-shrink-0 p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground hover:text-primary"
                title="Voice message"
              >
                <Mic className="h-5 w-5" />
              </button>

              {/* Send Button */}
              <Button
                type="submit"
                disabled={!user || (!newMessage.trim() && !image) || uploading}
                size="sm"
                className="flex-shrink-0 rounded-xl px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {uploading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs">Sending</span>
                  </div>
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="absolute bottom-full left-0 mb-2 z-50 shadow-2xl rounded-2xl overflow-hidden">
                <EmojiPicker
                  onEmojiClick={(emojiData) => {
                    setNewMessage((prev) => prev + emojiData.emoji);
                    setShowEmojiPicker(false);
                  }}
                />
              </div>
            )}
          </form>
        </div>

        {/* User Profile Modal */}
        {showUserProfile && selectedUser && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowUserProfile(false);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setShowUserProfile(false);
              }
            }}
            tabIndex={-1}
          >
            <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-in fade-in-0 zoom-in-95 duration-200">
              {/* Close button */}
              <button
                onClick={() => setShowUserProfile(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-muted rounded-full"
              >
                ✕
              </button>

              {/* Profile Header */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="h-10 w-10 text-white" />
                  </div>
                  {selectedUser.isOnline && (
                    <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-400 rounded-full border-2 border-card"></div>
                  )}
                </div>
                <h2 className="text-xl font-semibold mb-1">
                  {selectedUser.displayName || selectedUser.email || "User"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {selectedUser.email}
                </p>
              </div>

              {/* Profile Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm">
                    {selectedUser.isOnline ? "Online" : "Last seen recently"}
                  </span>
                </div>

                {selectedUser.about && (
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <h3 className="text-sm font-medium mb-2">About</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedUser.about}
                    </p>
                  </div>
                )}

                <div className="p-3 bg-muted/30 rounded-lg">
                  <h3 className="text-sm font-medium mb-2">User ID</h3>
                  <p className="text-xs text-muted-foreground font-mono">
                    {selectedUser.uid}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <Button className="flex-1" variant="outline">
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </Button>
                <Button className="flex-1" variant="outline">
                  <Video className="h-4 w-4 mr-2" />
                  Video
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
  );
};

export default ChatRoom;
