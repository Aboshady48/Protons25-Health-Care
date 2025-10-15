import React, { useState } from "react";
impo

export default function Ask() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    // Trim the question to ensure no whitespace-only strings are sent
    const questionToSend = question.trim(); 
    
    if (!questionToSend) {
      setAnswer("Please type a question before asking! 🧐");
      return;
    }
    
    setLoading(true);
    setAnswer(""); // Clear previous answer

    try {
      // 1. Send the request to the backend
      const res = await fetch("http://localhost:5000/api/ai/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Send the trimmed, verified question string
        body: JSON.stringify({ prompt: questionToSend }),
      });

      // 2. Check for non-2xx status codes (like 400 or 500)
      if (!res.ok) {
        // Attempt to read the error message from the server response body
        let errorDetails = `Server responded with status ${res.status}`;
        try {
            const errorData = await res.json();
            errorDetails = errorData.error || errorDetails;
        } catch (e) {
            // Failed to parse JSON error response
            console.error("Failed to parse error response from server:", e);
        }
        
        throw new Error(errorDetails);
      }
      
      // 3. Process success response
      const data = await res.json();
      
      // Update the state with the received reply
      setAnswer(data.reply || "No clear response from AI 😅");
      
      // Clear the input only if the API call was successful
      setQuestion(""); 
      
    } catch (err) {
      console.error("Frontend Request Error:", err.message);
      // Display a friendly error message
      setAnswer(`Something went wrong ❌: ${err.message}`);
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
        />
        <button 
          className="ask-btn" 
          onClick={handleAsk} 
          disabled={loading}
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </div>

      {answer && (
        <div className="answer-box">
          <h2>AI Response:</h2>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}
