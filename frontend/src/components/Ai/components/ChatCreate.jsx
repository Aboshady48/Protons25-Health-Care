import React, { useState, useRef, useEffect } from "react";
import api from "../api/axiosInstance";

export default function ChatCreate({ onChatCreated }) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [prompt]);

  const handleCreateChat = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const { data } = await api.post("/chats", { prompt });
      onChatCreated(data.chat);
      setPrompt("");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to create chat");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCreateChat();
    }
  };

  return (
    <div className="ask-chat-area"> {/* Full area for create */}
      <div className="ask-messages-container">
        <div className="ask-message-row">
          <div className="ask-avatar ask-avatar-assistant">🤖</div>
          <div className="ask-message-content">Start a new conversation by typing your prompt below.</div>
        </div>
      </div>
      <div className="ask-input-area">
        <div className="ask-input-wrapper">
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Start a new chat..."
            className="ask-textarea"
            disabled={loading}
            rows={1}
          />
          <button onClick={handleCreateChat} className="ask-send-icon" disabled={loading}>
            🚀
          </button>
        </div>
        {loading && (
          <div className="ask-loading-dots">
            <div className="ask-loading-dot" />
            <div className="ask-loading-dot" />
            <div className="ask-loading-dot" />
          </div>
        )}
      </div>
    </div>
  );
}