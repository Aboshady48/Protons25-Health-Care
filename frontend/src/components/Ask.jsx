import React, { useState } from "react";
import "../Style/Ask.css";

export default function Ask() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    const prompt = question.trim();

    if (!prompt) {
      setAnswer("⚠️ Please type a question before asking!");
      return;
    }

    setLoading(true);
    setAnswer("");

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
      setAnswer(data.reply || "🤔 The AI didn’t return a clear answer.");
      setQuestion("");
    } catch (err) {
      console.error("Frontend Request Error:", err.message);
      setAnswer(`❌ Something went wrong: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ask-container">
      <h1 className="ask-title">Ask Our AI Assistant 🤖</h1>

      <div className="ask-box">
        <textarea
          className="ask-input"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Type your question here..."
          rows={4}
          disabled={loading}
        />
        <button
          className={`ask-btn ${loading ? "disabled" : ""}`}
          onClick={handleAsk}
          disabled={loading}
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </div>

      {answer && (
        <div className="answer-box">
          <h2>💬 AI Response:</h2>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}