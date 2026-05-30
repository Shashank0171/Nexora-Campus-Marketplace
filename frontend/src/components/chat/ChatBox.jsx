import { useEffect, useState, useRef } from "react";
import api from "../../services/api";
import { useAuth } from "../../store/AuthContext";
import socket from "../../services/socket";
import { X, Send } from "lucide-react";

export default function ChatBox({ receiverId, productId, onClose }) {
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const bottomRef = useRef(null);

  const roomId = productId + "_" + user?._id + "_" + receiverId;

  // LOAD HISTORY
  const fetchMessages = async () => {
    try {
      const res = await api.get(
        `/messages/conversation/${receiverId}/${productId}`
      );
      setMessages(res.data.messages || []);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    if (receiverId && productId) fetchMessages();
  }, [receiverId, productId]);

  // JOIN ROOM
  useEffect(() => {
    if (!roomId) return;

    socket.emit("join_room", roomId);

    return () => {
      socket.off("receive_message");
    };
  }, [roomId]);

  // REAL TIME RECEIVE
  useEffect(() => {
    socket.on("receive_message", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => socket.off("receive_message");
  }, []);

  // AUTO SCROLL
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // SEND MESSAGE
  const sendMessage = () => {
    if (!text.trim()) return;

    socket.emit("send_message", {
      roomId,
      sender: user._id,
      receiver: receiverId,
      product: productId,
      text,
    });

    setText("");
  };

  return (
    <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">

      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
        <div>
          <h2 className="font-semibold text-black">Conversation</h2>
          <p className="text-xs text-slate-500">
            Nexora Chat
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-9 h-9 flex items-center justify-center rounded-xl border hover:bg-slate-50 transition"
        >
          <X size={16} />
        </button>
      </div>

      {/* MESSAGES */}
      <div className="h-80 overflow-y-auto px-3 py-4 bg-slate-50 space-y-2">

        {messages.map((msg) => {
          const isMine = msg.sender?._id === user?._id;

          return (
            <div
              key={msg._id}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 text-sm max-w-[75%] rounded-2xl shadow-sm break-words ${
                  isMine
                    ? "bg-black text-white rounded-br-md"
                    : "bg-white text-black border border-slate-200 rounded-bl-md"
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="flex items-center gap-2 p-3 border-t bg-white">

        <input
          className="flex-1 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-black transition"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
        />

        <button
          onClick={sendMessage}
          className="w-10 h-10 flex items-center justify-center bg-black text-white rounded-xl hover:bg-slate-900 transition"
        >
          <Send size={16} />
        </button>

      </div>
    </div>
  );
}