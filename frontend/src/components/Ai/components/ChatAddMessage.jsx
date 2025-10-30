import { useState, useRef, useEffect } from "react";
import api from "../api/axiosInstance";

export default function ChatAddMessage({ chatId, onNewMessages }) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [prompt]);

  const handleSend = async () => {
    if (!prompt.trim() || !chatId) return;
    setLoading(true);
    try {
      const { data } = await api.post(`/chats/${chatId}/messages`, { prompt });
      onNewMessages();
      setPrompt("");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="ask-input-area">
      <div className="ask-input-wrapper">
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="ask-textarea"
          disabled={loading}
          rows={1}
        />
        <button onClick={handleSend} className="ask-send-icon" disabled={loading}>
          Send
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
  );
}