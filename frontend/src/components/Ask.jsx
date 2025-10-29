import React, { useState, useRef, useEffect } from "react";
import "../Style/Ask.css";

export default function Ask() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi there! How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const handleSend = async () => {
    const prompt = input.trim();
    if (!prompt || loading) return;

    const newUserMessage = { role: "user", content: prompt };
    setMessages(prev => [...prev, newUserMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        let errorMsg = `Server error (${res.status})`;
        try {
          const errData = await res.json();
          errorMsg = errData.error || errorMsg;
        } catch {}
        throw new Error(errorMsg);
      }

      const data = await res.json();
      const aiResponse = { 
        role: "assistant", 
        content: data.reply || "I didn't return a clear answer." 
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (err) {
      console.error("Request Error:", err.message);
      const errorResponse = { 
        role: "assistant", 
        content: `Something went wrong: ${err.message}` 
      };
      setMessages(prev => [...prev, errorResponse]);
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
    <div className="ask-chat-container">
      {/* Header */}
      <div className="ask-chat-header">
        <h1 className="ask-chat-title">Ask Our AI Assistant</h1>
      </div>

      {/* Messages Container */}
      <div className="ask-messages-container">
        {messages.map((msg, idx) => (
          <div key={idx} className="ask-message-row">
            {/* Avatar */}
            <div className={`ask-avatar ${msg.role === "user" ? "ask-avatar-user" : "ask-avatar-assistant"}`}>
              {msg.role === "user" ? "Y" : "🤖"}
            </div>

            {/* Message Content */}
            <div className="ask-message-content">
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="ask-message-row">
            <div className="ask-avatar ask-avatar-assistant">
              🤖
            </div>
            <div className="ask-loading-dots">
              <div className="ask-loading-dot" />
              <div className="ask-loading-dot" />
              <div className="ask-loading-dot" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="ask-input-area">
        <div className="ask-input-wrapper">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
            disabled={loading}
            className="ask-textarea"
            rows={1}
            
          />
        </div>
      </div>
    </div>
  );
}