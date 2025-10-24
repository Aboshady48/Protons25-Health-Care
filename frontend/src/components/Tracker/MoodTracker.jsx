import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../Style/MoodTracker.css";

const MoodTracker = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/questions/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuestions(res.data.questions);
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleAnswer = (qIndex, value) => {
    setAnswers({ ...answers, [qIndex]: value });
    if (qIndex < questions.length - 1) setCurrentQuestion(qIndex + 1);
  };

  const handleSubmit = async () => {
    if (!questions.length) return;

    // Basic validation
    for (let i = 0; i < questions.length; i++) {
      if (answers[i] === undefined) {
        alert("Please answer all questions.");
        return;
      }
    }

    let total = 0,
      sleep_quality = 0,
      safety_level = 0;

    questions.forEach((q, i) => {
      const value = answers[i];
      if (q.question_type === "sleep") sleep_quality = value;
      else if (q.question_type === "safety") safety_level = value;
      else total += value;
    });

    let mood = "Neutral";
    if (total <= 4) mood = "Happy";
    else if (total <= 9) mood = "Excited";
    else if (total <= 14) mood = "Stressed";
    else if (total <= 19) mood = "Sad";
    else mood = "Anxious";

    const token = localStorage.getItem("token");
    if (!token) return alert("Please log in first.");

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/mood/add",
        { mood, total_score: total, sleep_quality, safety_level, details: "" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(res.data.mood);
    } catch (err) {
      console.error(err);
      alert("Error saving mood.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <p>Loading...</p>;
  if (!questions.length) return <p>No questions found</p>;

  return (
    <div className="mood-tracker">
      {!result ? (
        <div className="question-block slide">
          <h3>{questions[currentQuestion].question_text}</h3>
          <div className="options">
            {questions[currentQuestion].options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleAnswer(currentQuestion, opt.value)}
                className={`option-btn ${
                  answers[currentQuestion] === opt.value ? "selected" : ""
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {currentQuestion === questions.length - 1 && (
            <button
              className="submit-btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          )}
        </div>
      ) : (
        <div className="result-box">
          <h3>Your Mood: {result.mood}</h3>
          <p>Total Score: {result.total_score}</p>
          <button className="submit-btn" onClick={() => window.location.reload()}>
            Track Again
          </button>
        </div>
      )}
    </div>
  );
};

export default MoodTracker;
