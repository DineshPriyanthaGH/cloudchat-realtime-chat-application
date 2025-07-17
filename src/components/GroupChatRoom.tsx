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

interface Message {
  id: string;
  text: string;
  sender: string;
  createdAt: any;
  imageUrl?: string;
}

interface Group {
  id: string;
  name: string;
  members: string[];
}

const GroupChatRoom: React.FC<{ group: Group }> = ({ group }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const auth = getAuth();
  const user = auth.currentUser;

  const IMGBB_API_KEY = "866d197a9352670200efeb271c0d02be";

  const uploadImageToImgbb = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (data.success) {
      return data.data.url;
    } else {
      throw new Error("Image upload failed");
    }
  };

  useEffect(() => {
    const q = query(collection(db, "groups", group.id, "messages"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as any),
      }));
      setMessages(msgs);
      setLoading(false);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    });
    return unsubscribe;
  }, [group.id]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newMessage.trim() && !image) || !user) return;

    setUploading(true);
    let imageUrl = "";

    try {
      if (image) {
        imageUrl = await uploadImageToImgbb(image);
      }

      await addDoc(collection(db, "groups", group.id, "messages"), {
        text: newMessage,
        imageUrl,
        sender: user.displayName || user.email || "Anonymous",
        uid: user.uid,
        createdAt: serverTimestamp(),
      });

      setNewMessage("");
      setImage(null);
      setShowEmojiPicker(false);
    } catch (err: any) {
      alert("Failed to send message: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
      <div className="flex flex-col h-full w-full flex-1 border rounded-3xl bg-background shadow-lg font-sans overflow-hidden">
        {/* Header */}
        <div className="bg-primary text-primary-foreground p-4 rounded-t-3xl flex items-center gap-3 shadow">
          <div className="font-bold text-xl">{group.name}</div>
          <div className="text-sm opacity-80">Group Chat</div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 scrollbar-thin scrollbar-thumb-green-500 scrollbar-track-green-100">
          {loading ? (
              <div className="text-center text-gray-400 font-medium">Loading messages...</div>
          ) : (
              messages.map((msg) => {
                const isMe = msg.sender === (user?.displayName || user?.email);
                return (
                    <div
                        key={msg.id}
                        className={`flex flex-col max-w-md ${isMe ? "items-end ml-auto" : "items-start mr-auto"}`}
                    >
                      <div
                          className={`text-[11px] font-medium mb-1 uppercase ${isMe ? "text-primary" : "text-muted-foreground"}`}
                      >
                        {msg.sender}
                      </div>
                      <div
                          className={`relative rounded-3xl px-6 py-4 shadow break-words leading-relaxed text-base ${
                              isMe
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-muted-foreground border"
                          }`}
                      >
                        {msg.text}
                        {msg.imageUrl && (
                            <img
                                src={msg.imageUrl}
                                alt="uploaded"
                                className="mt-3 max-w-xs max-h-60 rounded-xl border"
                            />
                        )}
                      </div>
                      {msg.createdAt?.toDate && (
                          <div
                              className={`text-[11px] mt-1 font-mono ${isMe ? "text-primary" : "text-muted-foreground"}`}
                          >
                            {msg.createdAt.toDate().toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                      )}
                    </div>
                );
              })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Section */}
        <form
            onSubmit={handleSend}
            className="relative flex gap-4 p-4 border-t bg-background rounded-b-3xl shadow-inner"
        >
          <button
              type="button"
              onClick={() => setShowEmojiPicker((prev) => !prev)}
              className="text-2xl focus:outline-none"
              title="Add Emoji"
          >
            😊
          </button>

          {showEmojiPicker && (
              <div className="absolute bottom-20 left-5 z-50">
                <EmojiPicker
                    onEmojiClick={(emojiData) => setNewMessage((prev) => prev + emojiData.emoji)}
                    theme="light"
                />
              </div>
          )}

          <input
              type="file"
              accept="image/*"
              id="group-image-upload"
              className="hidden"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              disabled={uploading}
          />
          <label
              htmlFor="group-image-upload"
              className="text-xl cursor-pointer"
              title="Attach image"
          >
            📎
          </label>

          {image && (
              <span className="text-xs text-gray-500 truncate max-w-[100px]">{image.name}</span>
          )}

          <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-5 py-3 border border-gray-300 bg-gray-100 text-gray-700 placeholder-gray-500 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
              disabled={uploading}
              autoComplete="off"
          />

          <Button
              type="submit"
              disabled={!user || (!newMessage.trim() && !image) || uploading}
              className="rounded-full px-8 py-4 text-lg animate-glow"
          >
            {uploading ? "Sending..." : "Send"}
          </Button>
        </form>
      </div>
  );
};

export default GroupChatRoom;
