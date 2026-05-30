import { useEffect, useState, useRef } from "react";
import api from "../../services/api";
import { useAuth } from "../../store/AuthContext";
import socket from "../../services/socket";
import { Send } from "lucide-react";

export default function Messages() {
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [text, setText] = useState("");

  const bottomRef = useRef(null);

  // fetch
  useEffect(() => {
    api.get("/messages").then((res) => {
      setMessages(res.data.messages || []);
    });
  }, []);

  // realtime
  useEffect(() => {
    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("receive_message");
  }, []);

  // scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat, messages]);

  // build conversations
  useEffect(() => {
    const map = new Map();

    messages.forEach((msg) => {
      const other =
        msg.sender?._id === user?._id
          ? msg.receiver
          : msg.sender;

      if (!other || !msg.product) return;

      const key = msg.product._id + other._id;

      map.set(key, {
        key,
        user: other,
        product: msg.product,
        lastMessage: msg.text,
      });
    });

    setConversations([...map.values()]);
  }, [messages, user]);

  const sendMessage = () => {
    if (!activeChat || !text.trim()) return;

    const roomId =
      activeChat.product._id +
      "_" +
      user._id +
      "_" +
      activeChat.user._id;

    socket.emit("send_message", {
      roomId,
      sender: user._id,
      receiver: activeChat.user._id,
      product: activeChat.product._id,
      text,
    });

    setText("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50 pt-20 px-4">

      <div className="max-w-6xl mx-auto border border-black/10 rounded-3xl overflow-hidden shadow-lg bg-white">

        <div className="grid md:grid-cols-3 h-[80vh]">

          {/* LEFT CHAT LIST */}
          <div className="border-r bg-white overflow-y-auto">

            <div className="p-4 border-b">
              <h2 className="font-bold text-lg">Messages</h2>
              <p className="text-xs text-black/50">
                Your conversations
              </p>
            </div>

            <div className="p-3 space-y-2">

              {conversations.length === 0 && (
                <p className="text-sm text-black/40 p-3">
                  No conversations yet
                </p>
              )}

              {conversations.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setActiveChat(c)}
                  className={`w-full text-left p-3 rounded-2xl transition border ${
                    activeChat?.key === c.key
                      ? "bg-indigo-500 text-white border-indigo-500"
                      : "bg-white hover:bg-indigo-50 border-black/5"
                  }`}
                >

                  <div className="flex justify-between">
                    <span className="font-semibold text-sm">
                      {c.user.fullName}
                    </span>
                  </div>

                  <p className="text-xs mt-1 opacity-80">
                    {c.product.title}
                  </p>

                  <p className="text-xs mt-2 opacity-60 truncate">
                    {c.lastMessage}
                  </p>

                </button>
              ))}
            </div>
          </div>

          {/* CHAT WINDOW */}
          <div className="md:col-span-2 flex flex-col bg-indigo-50/30">

            {!activeChat ? (
              <div className="flex-1 flex items-center justify-center text-black/40">
                Select a chat to start messaging
              </div>
            ) : (
              <>
                {/* HEADER */}
                <div className="p-4 bg-white border-b">
                  <h3 className="font-semibold">
                    {activeChat.user.fullName}
                  </h3>
                  <p className="text-xs text-black/50">
                    {activeChat.product.title}
                  </p>
                </div>

                {/* MESSAGES */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">

                  {messages
                    .filter(
                      (m) =>
                        m.product?._id === activeChat.product._id &&
                        (
                          (m.sender?._id === user?._id &&
                            m.receiver?._id === activeChat.user._id) ||
                          (m.sender?._id === activeChat.user._id &&
                            m.receiver?._id === user?._id)
                        )
                    )
                    .map((msg) => {
                      const mine = msg.sender?._id === user?._id;

                      return (
                        <div
                          key={msg._id}
                          className={`flex ${
                            mine ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`px-4 py-2 max-w-[70%] text-sm rounded-2xl shadow-sm ${
                              mine
                                ? "bg-indigo-600 text-white rounded-br-md"
                                : "bg-white text-black rounded-bl-md border"
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
                <div className="p-3 bg-white border-t flex gap-2">

                  <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 border rounded-2xl px-4 py-2 outline-none focus:border-indigo-500"
                  />

                  <button
                    onClick={sendMessage}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-2xl hover:bg-indigo-700 transition flex items-center gap-2"
                  >
                    <Send size={16} />
                  </button>

                </div>

              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}