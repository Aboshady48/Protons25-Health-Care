import React, { useState, useEffect } from "react";
import "../../Style/MoodTracker.css";
import axios from "axios";

const MoodTracker = () => {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(false);

  const questions = [
    "Over the past few days, how often have you felt little interest or pleasure in doing things?",
    "How often have you felt down, depressed, or hopeless?",
    "How often have you felt nervous, anxious, or on edge?",
    "How often have you had trouble relaxing or calming down?",
    "Have you noticed changes in your sleep (falling asleep, staying asleep, waking up too early)?",
    "How often have you felt tired or had little energy, even after rest?",
    "How often have you had difficulty concentrating (e.g., reading, working, conversations)?",
    "How often have you felt bad about yourself — that you are a failure or have let yourself/others down?",
    "How often have you felt irritable, restless, or had trouble sitting still?",
    "Have you had thoughts that you would be better off not being here, or of hurting yourself?",
  ];

  const options = {
    default: [
      { label: "Not at all", value: 0 },
      { label: "Several days", value: 1 },
      { label: "More than half the days", value: 2 },
      { label: "Nearly every day", value: 3 },
    ],
    sleep: [
      { label: "No problems with sleep", value: 0 },
      { label: "Mild issues", value: 1 },
      { label: "Moderate issues", value: 2 },
      { label: "Severe issues", value: 3 },
    ],
    safety: [
      { label: "Never", value: 0 },
      { label: "Sometimes, but fleeting", value: 1 },
      { label: "Frequently, but I don’t intend to act", value: 2 },
      { label: "Yes, with serious intent", value: 3 },
    ],
  };

  useEffect(() => {
    setAnswers({});
    setResult(null);
    setCurrentQuestion(0);
  }, []);

  const handleAnswer = (qIndex, value) => {
    setAnswers({ ...answers, [qIndex]: value });
    if (qIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(qIndex + 1);
      }, 400);
    }
  };

  const handleSubmit = async () => {
    for (let i = 0; i < 9; i++) {
      if (i === 4) continue;
      if (answers[i] === undefined) {
        alert("Please answer all questions before submitting.");
        return;
      }
    }

    const total = Object.entries(answers)
      .filter(([key]) => key !== "4")
      .reduce((sum, [, value]) => sum + value, 0);

    const sleep_quality = answers[4] ?? 0;
    const safety_level = answers[9] ?? 0;

    // Determine mood category
    let mood = "Neutral";
    if (total <= 4) mood = "Happy";
    else if (total <= 9) mood = "Excited";
    else if (total <= 14) mood = "Stressed";
    else if (total <= 19) mood = "Sad";
    else mood = "Anxious";

    let safetyMessage = "";
    if (answers[9] > 0) {
      if (answers[9] === 1)
        safetyMessage = "⚠️ You mentioned fleeting thoughts of self-harm.";
      else if (answers[9] === 2)
        safetyMessage = "❗ You reported frequent self-harm thoughts.";
      else if (answers[9] === 3)
        safetyMessage = "🚨 Serious risk identified. Please seek help immediately.";
    }

    const details = `
      Mood: ${mood}.
      Total Score: ${total}/30.
      Sleep Quality: ${["None", "Mild", "Moderate", "Severe"][sleep_quality]}.
      ${safetyMessage || ""}
    `;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in first.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/mood/add",
        {
          mood,
          total_score: total,
          sleep_quality,
          safety_level,
          details,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResult({
        total,
        sleep: sleep_quality,
        mood,
        details: res.data.mood.details || details,
        safetyMessage,
      });

      alert("✅ Mood recorded successfully!");
    } catch (err) {
      console.error("Error submitting mood:", err);
      alert(err.response?.data?.error || "Failed to record mood. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mood-tracker">
      <h2>Mood Tracker</h2>

      {!result && (
        <div key={currentQuestion} className="question-block slide">
          <p>
            {currentQuestion + 1}. {questions[currentQuestion]}
          </p>
          <div className="options">
            {(
              currentQuestion === 4
                ? options.sleep
                : currentQuestion === 9
                ? options.safety
                : options.default
            ).map((opt) => (
              <button
                key={opt.label}
                className={`option-btn ${
                  answers[currentQuestion] === opt.value ? "selected" : ""
                }`}
                onClick={() => handleAnswer(currentQuestion, opt.value)}
                disabled={loading}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {currentQuestion === questions.length - 1 && !result && (
        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      )}

      {result && (
        <div className="result-box">
          <h3>Your Results</h3>
          <p>
            <strong>Mood:</strong> {result.mood}
          </p>
          <p>
            <strong>Total Score:</strong> {result.total} / 30
          </p>
          {result.sleep !== null && (
            <p>
              <strong>Sleep issues:</strong>{" "}
              {["None", "Mild", "Moderate", "Severe"][result.sleep]}
            </p>
          )}
          {result.safetyMessage && (
            <p className="safety-warning">{result.safetyMessage}</p>
          )}
          <p className="details-text">{result.details}</p>
          <button onClick={() => window.location.reload()} className="submit-btn">
            Track Again
          </button>
        </div>
      )}
    </div>
  );
};

export default MoodTracker;
