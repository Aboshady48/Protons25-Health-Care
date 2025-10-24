import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../Style/Biorhythm.css";

const Biorhythm = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [scores, setScores] = useState({});
  const [result, setResult] = useState(null);
  const [profiles, setProfiles] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [qRes, pRes] = await Promise.all([
          axios.get("http://localhost:5000/api/biorhythm/questions", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/biorhythm/profiles", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setQuestions(qRes.data.questions);
        const profMap = {};
        pRes.data.profiles.forEach(p => (profMap[p.profile_key] = p));
        setProfiles(profMap);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleAnswer = (option) => {
    const qId = questions[currentQ].question_id;
    setAnswers({ ...answers, [qId]: option.id });

    // accumulate scores
    const newScores = { ...scores };
    Object.keys(option.points).forEach((key) => {
      newScores[key] = (newScores[key] || 0) + option.points[key];
    });
    setScores(newScores);

    if (currentQ + 1 < questions.length) {
      setCurrentQ(currentQ + 1);
    } else {
      submitResults(newScores);
    }
  };

  const submitResults = async (finalScores) => {
    const token = localStorage.getItem("token");
    const topProfile = Object.keys(finalScores).reduce((a, b) =>
      finalScores[a] > finalScores[b] ? a : b
    );

    setLoading(true);
    try {
      await axios.post(
        "http://localhost:5000/api/biorhythm/questions/result",
        { answers, scores: finalScores, top_profile: topProfile },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(topProfile);
    } catch (err) {
      console.error(err);
      alert("Error saving biorhythm result");
    } finally {
      setLoading(false);
    }
  };

  if (!questions.length) return <p>Loading...</p>;

  return (
    <div className="biorhythm-container">
      {!result ? (
        <div className="question-block slide">
          <h3>{questions[currentQ].question_text}</h3>
          <div className="options">
            {questions[currentQ].options.map(opt => (
              <button
                key={opt.id}
                onClick={() => handleAnswer(opt)}
                className={`option-btn ${
                  answers[questions[currentQ].question_id] === opt.id ? "selected" : ""
                }`}
              >
                {opt.text}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="result-block">
          <h2>{profiles[result]?.profile_name}</h2>
          <p>{profiles[result]?.description}</p>
          <button className="submit-btn" onClick={() => window.location.reload()}>
            Restart
          </button>
        </div>
      )}
    </div>
  );
};

export default Biorhythm;
