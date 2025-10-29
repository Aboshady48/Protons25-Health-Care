import React, { useEffect, useState, useRef } from "react";
import api from "../api/axiosInstance";

export default function ChatView({ chatId, refreshKey }) {
  const [chat, setChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const fetchChat = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/chats/${chatId}`);
      setChat(data.chat);
    } catch (err) {
      console.error("Error fetching chat:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (chatId) fetchChat();
  }, [chatId, refreshKey]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]);

  if (loading) {
    return (
      <div className="ask-messages-container">
        <div className="ask-message-row">
          <div className="ask-avatar ask-avatar-assistant">🤖</div>
          <div className="ask-loading-dots">
            <div className="ask-loading-dot" />
            <div className="ask-loading-dot" />
            <div className="ask-loading-dot" />
          </div>
        </div>
      </div>
    );
  }

  if (!chat) {
    return <div className="ask-empty-chat">No chat found...</div>;
  }

  return (
    <div className="ask-messages-container">
      {chat.messages.map((msg, idx) => (
        <div key={idx} className="ask-message-row">
          <div className={`ask-avatar ${msg.sender === "user" ? "ask-avatar-user" : "ask-avatar-assistant"}`}>
            {msg.sender === "user" ? "Y" : "🤖"}
          </div>
          <div className="ask-message-content">{msg.content}</div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}