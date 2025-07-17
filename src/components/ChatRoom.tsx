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

interface Message {
  id: string;
  text: string;
  sender: string;
  createdAt: any;
}

interface ChatRoomProps {
  chatId?: string;
  selectedUser?: {
    displayName?: string;
    email?: string;
  };
}

const ChatRoom: React.FC<ChatRoomProps> = ({ chatId = "global", selectedUser }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const q = query(
        collection(db, "chats", chatId, "messages"),
        orderBy("createdAt", "asc")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs: Message[] = [];
      querySnapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...(doc.data() as any) });
      });
      setMessages(msgs);
      setLoading(false);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    });
    return unsubscribe;
  }, [chatId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;
    await addDoc(collection(db, "chats", chatId, "messages"), {
      text: newMessage,
      sender: user.displayName || user.email || "Anonymous",
      uid: user.uid,
      createdAt: serverTimestamp(),
    });
    setNewMessage("");
  };

  return (
      <div className="flex flex-col h-full w-full flex-1 border rounded-3xl bg-white shadow-lg font-sans overflow-hidden">
        {/*  WhatsApp-style chat header */}
        <div className="bg-green-700 p-3 rounded-t-xl flex items-center gap-3 shadow-md">
          <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded-full font-semibold text-lg">
            {selectedUser?.displayName?.charAt(0).toUpperCase() || "C"}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {selectedUser?.displayName || selectedUser?.email || "Chat"}
            </h2>
            <p className="text-xs text-green-600 font-medium">Online</p>
          </div>
        </div>

        {/* 🟢 Chat messages */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 scrollbar-thin scrollbar-thumb-green-500 scrollbar-track-green-100">
          {loading ? (
              <div className="text-center text-gray-400 text-lg font-medium tracking-wide">
                Loading messages...
              </div>
          ) : (
              messages.map((msg) => {
                const isMe = msg.sender === (user?.displayName || user?.email);
                return (
                    <div
                        key={msg.id}
                        className={`flex flex-col max-w-md ${
                            isMe ? "items-end ml-auto" : "items-start mr-auto"
                        }`}
                    >
                      <div
                          className={`text-[11px] font-medium mb-1 select-none tracking-wide uppercase ${
                              isMe ? "text-green-700" : "text-gray-500"
                          }`}
                          style={{
                            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                            letterSpacing: "0.05em",
                          }}
                      >
                        {msg.sender}
                      </div>

                      <div
                          className={`relative rounded-3xl px-6 py-4 shadow-md break-words leading-relaxed text-[1rem] ${
                              isMe
                                  ? "bg-green-600 text-white"
                                  : "bg-white text-gray-900 border border-gray-300"
                          }`}
                          style={{ wordBreak: "break-word" }}
                      >
                        {msg.text}
                        <div
                            className={`absolute bottom-0 w-3 h-3 bg-transparent ${
                                isMe
                                    ? "-right-1 rounded-bl-[16px] bg-green-600"
                                    : "-left-1 rounded-br-[16px] bg-white border border-gray-300"
                            }`}
                            style={{ transform: "translateY(50%)" }}
                        />
                      </div>

                      {msg.createdAt?.toDate && (
                          <div
                              className={`text-[11px] opacity-60 mt-1 font-mono select-none ${
                                  isMe ? "text-green-700 text-right" : "text-gray-500 text-left"
                              }`}
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

        {/* 🕽️ Input bar */}
        <form
            onSubmit={handleSend}
            className="flex gap-4 p-5 border-t border-gray-200 bg-white rounded-b-3xl shadow-inner"
        >
          <input
              type="text"
              className="flex-1 px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-4 focus:ring-green-400 transition text-gray-700 placeholder-gray-400"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={!user}
              autoComplete="off"
          />
          <Button
              type="submit"
              disabled={!user || !newMessage.trim()}
              className="bg-green-600 hover:bg-green-700 text-white rounded-full px-8 py-3 shadow-lg transition-transform active:scale-95"
          >
            Send
          </Button>
        </form>
      </div>
  );
};

export default ChatRoom;
