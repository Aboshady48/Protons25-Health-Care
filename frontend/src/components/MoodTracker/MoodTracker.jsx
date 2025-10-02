import React, { useState, useEffect } from "react";
import "../../Style/MoodTracker.css";

const MoodTracker = () => {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);

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

  const handleSubmit = () => {
    for (let i = 0; i < 9; i++) {
      if (i === 4) continue;
      if (answers[i] === undefined) {
        alert("Please answer all questions before submitting.");
        return;
      }
    }

    let total = 0;
    for (let i = 0; i < 9; i++) {
      if (i === 4) continue;
      total += answers[i];
    }

    let details = null;

    if (total <= 4) {
      details = (
        <>
          <p>You're in a stable place right now. Life may bring normal ups and downs, but overall, you’re maintaining a healthy balance.</p>
          <p><strong>How to keep it up:</strong></p>
          <ul>
            <li>Stick to your daily routine (regular sleep & meals).</li>
            <li>Do light exercise (like walking or stretching).</li>
            <li>Make time for joy (reading, music, hobbies).</li>
            <li>Share your thoughts with someone you trust.</li>
          </ul>
          <p><strong>Benefits:</strong></p>
          <ul>
            <li>Lower stress</li>
            <li>Stronger resilience</li>
            <li>More awareness of your emotions</li>
            <li>Collecting daily moments of happiness</li>
          </ul>
          <p><strong>Activities to try:</strong></p>
          <ul>
            <li>Yoga or meditation for calming the mind.</li>
            <li>Spending time in nature (parks, seaside, or balcony).</li>
            <li>Creative outlets like coloring, writing, or photography.</li>
            <li>Gratitude journaling: write 3 things you’re grateful for each day.</li>
          </ul>
        </>
      );
    } else if (total <= 9) {
      details = (
        <>
          <p>Your mood has some mild dips, but self-care and consistency can help you rebalance.</p>
          <p><strong>How to fix it:</strong></p>
          <ul>
            <li>Maintain a consistent sleep schedule.</li>
            <li>Practice brief daily relaxation techniques.</li>
            <li>Engage in small, meaningful daily activities.</li>
            <li>Stay socially connected.</li>
          </ul>
          <p><strong>Benefits:</strong></p>
          <ul>
            <li>Reduced stress and anxiety</li>
            <li>Better mood and emotional stability</li>
            <li>Improved energy, focus, and productivity</li>
            <li>Strengthened resilience to everyday stressors</li>
          </ul>
          <p><strong>Activities to try:</strong></p>
          <ul>
            <li>15–20 minute brisk walk or light cardio/yoga</li>
            <li>Mindfulness: 5–10 minutes meditation</li>
            <li>Journaling: note 3 small wins or gratitude</li>
            <li>Skill-building or hobbies: creative projects</li>
            <li>Nature exposure</li>
            <li>Digital detox breaks</li>
          </ul>
        </>
      );
    } else if (total <= 14) {
      details = (
        <>
          <p>You’re experiencing moderate symptoms. This can feel heavy, but lifestyle changes and support will help.</p>
          <p><strong>How to fix it:</strong></p>
          <ul>
            <li>Track your mood daily to notice patterns.</li>
            <li>Maintain structured routines.</li>
            <li>Practice stress management techniques.</li>
            <li>Break tasks into small, manageable steps.</li>
          </ul>
          <p><strong>Benefits:</strong></p>
          <ul>
            <li>Reduced emotional swings</li>
            <li>More predictable energy and sleep</li>
            <li>Stronger coping skills</li>
            <li>Increased focus</li>
          </ul>
          <p><strong>Activities to try:</strong></p>
          <ul>
            <li>Structured hobbies: cooking, gardening</li>
            <li>Cognitive exercises: puzzles, games</li>
            <li>Household organization</li>
            <li>Creative problem-solving</li>
            <li>Physical challenge: light workouts</li>
          </ul>
        </>
      );
    } else if (total <= 19) {
      details = (
        <>
          <p>Your symptoms are moderately severe. Stronger support may be needed.</p>
          <p><strong>How to fix it:</strong></p>
          <ul>
            <li>Seek professional support (therapist, GP)</li>
            <li>Create a structured daily routine</li>
            <li>Prioritize sleep hygiene and nutrition</li>
            <li>Use active stress reduction</li>
            <li>Limit triggers</li>
          </ul>
          <p><strong>Benefits:</strong></p>
          <ul>
            <li>Reduced risk of worsening symptoms</li>
            <li>Improved clarity for responsibilities</li>
            <li>Increased emotional stability</li>
            <li>Stronger sense of control</li>
          </ul>
          <p><strong>Activities to try:</strong></p>
          <ul>
            <li>Professional exercises assigned by counselor</li>
            <li>Skill-building projects</li>
            <li>Mindful physical activity</li>
            <li>Goal-setting sessions</li>
            <li>Community engagement</li>
            <li>Check-in routine with trusted people</li>
          </ul>
        </>
      );
    } else {
      details = (
        <>
          <p>Your symptoms are severe. Please seek professional help urgently.</p>
          <p><strong>How to fix it:</strong></p>
          <ul>
            <li>Seek immediate professional help</li>
            <li>Do not stay alone if unsafe</li>
            <li>Avoid trying to manage alone</li>
            <li>Asking for help is a sign of strength</li>
          </ul>
          <p><strong>Benefits:</strong></p>
          <ul>
            <li>Immediate reduction of risk</li>
            <li>Access to professional support</li>
            <li>Emotional stabilization</li>
            <li>Safe environment to begin recovery</li>
          </ul>
          <p><strong>Activities to try:</strong></p>
          <ul>
            <li>Call/message crisis line</li>
            <li>Stay with trusted person</li>
            <li>Follow professional instructions</li>
            <li>Use grounding techniques</li>
            <li>Create short-term safety plan</li>
          </ul>
        </>
      );
    }

    let safetyMessage = "";
    if (answers[9] > 0) {
      if (answers[9] === 1) {
        safetyMessage = "⚠️ You mentioned fleeting thoughts of self-harm...";
      } else if (answers[9] === 2) {
        safetyMessage = "❗ You reported frequent self-harm thoughts...";
      } else if (answers[9] === 3) {
        safetyMessage = "🚨 Serious risk identified. Please call emergency services immediately.";
      }
    }

    setResult({
      total,
      sleep: answers[4] ?? null,
      details,
      safetyMessage,
    });
  };

  return (
    <div className="mood-tracker">
      <h2>Mood Tracker</h2>

      <div key={currentQuestion} className="question-block slide">
        <p>{currentQuestion + 1}. {questions[currentQuestion]}</p>
        <div className="options">
          {(currentQuestion === 4 ? options.sleep :
            currentQuestion === 9 ? options.safety :
            options.default).map((opt) => (
            <button
              key={opt.label}
              className={`option-btn ${answers[currentQuestion] === opt.value ? "selected" : ""}`}
              onClick={() => handleAnswer(currentQuestion, opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {currentQuestion === questions.length - 1 && (
        <button className="submit-btn" onClick={handleSubmit}>Submit</button>
      )}

      {result && (
        <div className="result-box">
          <h3>Results</h3>
          <div className="details-text">{result.details}</div>
          {result.sleep !== null && (
            <p><strong>Sleep issues:</strong> {["None", "Mild", "Moderate", "Severe"][result.sleep]}</p>
          )}
          {result.safetyMessage && <p className="safety-warning">{result.safetyMessage}</p>}
        </div>
      )}
    </div>
  );
};

export default MoodTracker;