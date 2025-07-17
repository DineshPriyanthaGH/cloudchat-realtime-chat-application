import React, { useEffect, useRef, useState } from "react";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebaseConfig";
import { Button } from "./ui/button";

interface Message {
  id: string;
  text: string;
  sender: string;
  createdAt: any;
}

interface Group {
  id: string;
  name: string;
  members: string[];
}

const GroupChatRoom: React.FC<{ group: Group }> = ({ group }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    console.log("[GroupChatRoom] group prop:", group);
    const q = query(
      collection(db, "groups", group.id, "messages"),
      orderBy("createdAt", "asc")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs: Message[] = [];
      querySnapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...(doc.data() as any) });
      });
      console.log(`[GroupChatRoom] Loaded ${msgs.length} messages for group ${group.id}`);
      setMessages(msgs);
      setLoading(false);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    });
    return unsubscribe;
  }, [group.id]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;
    await addDoc(collection(db, "groups", group.id, "messages"), {
      text: newMessage,
      sender: user.displayName || user.email || "Anonymous",
      uid: user.uid,
      createdAt: serverTimestamp(),
    });
    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-full w-full flex-1 border rounded-2xl bg-chat-bg shadow-lg p-2">
      <div className="flex items-center justify-between px-4 py-2 bg-whatsapp-dark rounded-t-2xl mb-2">
        <div className="text-lg font-bold text-white">{group.name}</div>
        <div className="text-xs text-white opacity-70">Group Chat</div>
      </div>
      {/* Debug info */}
      <div className="px-4 py-2 text-xs text-gray-500 bg-yellow-50 border border-yellow-200 rounded mb-2">
        <div>Debug: group.id = <b>{group.id}</b></div>
        <div>Debug: group.name = <b>{group.name}</b></div>
        <div>Debug: group.members = <b>{JSON.stringify(group.members)}</b></div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="text-center text-gray-400">Loading messages...</div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender === (user?.displayName || user?.email);
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`rounded-2xl px-4 py-2 max-w-xs shadow
                  ${isMe ? 'bg-whatsapp-green text-white' : 'bg-white text-gray-900 border'}`}>
                  <div className="text-xs opacity-70 mb-1">{msg.sender}</div>
                  <div>{msg.text}</div>
                  {msg.createdAt?.toDate && (
                    <div className="text-[10px] opacity-60 mt-1 text-right">{msg.createdAt.toDate().toLocaleTimeString()}</div>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} className="flex gap-2 p-3 border-t bg-white rounded-b-2xl">
        <input
          type="text"
          className="flex-1 px-3 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-whatsapp-green"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={!user}
        />
        <Button type="submit" disabled={!user || !newMessage.trim()} className="bg-whatsapp-green hover:bg-whatsapp-dark text-white rounded-full px-6">
          Send
        </Button>
      </form>
    </div>
  );
};

export default GroupChatRoom; 