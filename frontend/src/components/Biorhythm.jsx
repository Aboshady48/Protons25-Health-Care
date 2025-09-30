import React, { useState } from "react";
import '../Style/Biorhythm.css'

const questions = [
  {
    id: "q1",
    text: "What time do you usually wake up on weekdays?",
    options: [
      { text: "Before 6:00 AM", points: { Morning: 3, Evening: 0, Midday: 0, Afternoon: 0, Balanced: 0, Variable: 0, ShortSleeper: 0, SlowStarter: 0 } },
      { text: "6:00–8:00 AM", points: { Midday: 3, Balanced: 2 } },
      { text: "8:00–10:00 AM", points: { Afternoon: 3, SlowStarter: 2 } },
      { text: "After 10:00 AM", points: { Evening: 3 } },
    ],
  },
  {
    id: "q2",
    text: "How many hours of sleep do you usually get per night?",
    options: [
      { text: "Less than 5 hours", points: { Evening: 2, ShortSleeper: 3 } },
      { text: "5–6 hours", points: { Afternoon: 2, SlowStarter: 2 } },
      { text: "7–8 hours", points: { Morning: 3, Midday: 3, Balanced: 3 } },
      { text: "More than 8 hours", points: {} },
    ],
  },
  {
    id: "q3",
    text: "At what time of day do you usually feel most energetic?",
    options: [
      { text: "Early morning (6–10 AM)", points: { Morning: 3 } },
      { text: "Midday (11 AM–2 PM)", points: { Midday: 3, Balanced: 2 } },
      { text: "Afternoon (3–6 PM)", points: { Afternoon: 3 } },
      { text: "Evening (7–10 PM)", points: { Evening: 3 } },
      { text: "Late night (after 10 PM)", points: { Evening: 2, Variable: 1 } },
    ],
  },
  {
    id: "q4",
    text: "When do you usually feel most tired or low in energy?",
    options: [
      { text: "Morning", points: { Morning: 3, SlowStarter: 2 } },
      { text: "Afternoon slump (2–5 PM)", points: { Midday: 3, Afternoon: 3 } },
      { text: "Evening", points: { Evening: 3 } },
      { text: "It varies a lot", points: { Balanced: 3, Variable: 3 } },
    ],
  },
  {
    id: "q5",
    text: "When do you usually prefer your largest meal?",
    options: [
      { text: "Breakfast", points: { Morning: 3 } },
      { text: "Lunch", points: { Midday: 3, SlowStarter: 2 } },
      { text: "Dinner", points: { Evening: 3 } },
      { text: "I eat similar amounts at each meal", points: { Balanced: 3 } },
    ],
  },
  {
    id: "q6",
    text: "When do you feel most focused or productive for studying/work?",
    options: [
      { text: "Early morning", points: { Morning: 3 } },
      { text: "Midday", points: { Midday: 3, Balanced: 2 } },
      { text: "Afternoon", points: { Afternoon: 3, SlowStarter: 2 } },
      { text: "Evening/night", points: { Evening: 3 } },
    ],
  },
  {
    id: "q7",
    text: "What type of exercise feels best for you?",
    options: [
      { text: "Morning workout", points: { Morning: 3, Balanced: 2 } },
      { text: "Afternoon workout", points: { Midday: 3, Afternoon: 3, SlowStarter: 2 } },
      { text: "Evening workout", points: { Evening: 3, Balanced: 2 } },
      { text: "Don’t usually exercise", points: {} },
    ],
  },
];

const profiles = {
  Morning: {
    name: "Morning Type (Early Bird)",
    description: [
      "Best Focus: Early morning (6–10 AM).",
      "Best Exercise Time: Morning workouts give you energy.",
      "Meal Rhythm: A good breakfast is key for your day.",
      "Tip: Plan creative or study-heavy tasks early. Use afternoons for light work or rest.",
    ],
  },
  Midday: {
    name: "Midday Type (Balanced)",
    description: [
      "Best Focus: Late morning to early afternoon.",
      "Best Exercise Time: Around lunch or early afternoon.",
      "Meal Rhythm: Lunch is your main refuel point.",
      "Tip: Structure important tasks between 10 AM–2 PM, and keep evenings lighter.",
    ],
  },
  Afternoon: {
    name: "Afternoon Type (Productive After Lunch)",
    description: [
      "Best Focus: Afternoon (2–6 PM).",
      "Best Exercise Time: Late afternoon workouts feel natural.",
      "Meal Rhythm: Balanced meals, but avoid heavy lunch that causes energy dips.",
      "Tip: Do routine tasks in the morning, save big goals and studying for the afternoon peak.",
    ],
  },
  Evening: {
    name: "Evening/Night Type (Night Owl)",
    description: [
      "Best Focus: Evening or late night.",
      "Best Exercise Time: Evening workouts boost mood.",
      "Meal Rhythm: Lighter breakfast, larger dinner suits your rhythm.",
      "Tip: Organize your day so that creative or focus-heavy tasks are at night, and mornings are slower.",
    ],
  },
  Balanced: {
    name: "Balanced Type (All-Day Steady)",
    description: [
      "Best Focus: Moderate focus spread throughout the day.",
      "Best Exercise Time: Flexible, can do morning or evening.",
      "Meal Rhythm: Three balanced meals, not too early or late.",
      "Tip: You’re naturally adaptable. Use this to adjust when life gets busy.",
    ],
  },
  Variable: {
    name: "Variable Type (Energy Shifter)",
    description: [
      "Best Focus: It changes — sometimes morning, sometimes night.",
      "Best Exercise Time: Whenever energy feels high.",
      "Meal Rhythm: Irregular — sometimes skipping meals or eating late.",
      "Tip: Track your mood/energy daily so the planner can adjust for your “shifting rhythm.”",
    ],
  },
  ShortSleeper: {
    name: "Short-Sleeper Type (High Energy, Less Sleep)",
    description: [
      "Best Focus: Sharp bursts of focus throughout the day.",
      "Best Exercise Time: Short, intense workouts (any time).",
      "Meal Rhythm: Small meals/snacks keep energy stable.",
      "Tip: Use your bursts wisely — do big tasks in short focus windows.",
    ],
  },
  SlowStarter: {
    name: "Slow-Starter Type (Late Energizer)",
    description: [
      "Best Focus: Starts low in the morning, energy builds slowly.",
      "Best Exercise Time: Midday or afternoon works best.",
      "Meal Rhythm: Light breakfast, bigger lunch.",
      "Tip: Don’t pressure yourself early. Schedule important tasks later in the day.",
    ],
  },
};

export default function App() {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  function handleChange(qid, optionIndex) {
    setAnswers((prev) => ({ ...prev, [qid]: optionIndex }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    // Initialize scores
    const scores = {
      Morning: 0,
      Midday: 0,
      Afternoon: 0,
      Evening: 0,
      Balanced: 0,
      Variable: 0,
      ShortSleeper: 0,
      SlowStarter: 0,
    };

    // Calculate scores
    for (const q of questions) {
      const selectedIndex = answers[q.id];
      if (selectedIndex === undefined) {
        alert("Please answer all questions.");
        return;
      }
      const option = q.options[selectedIndex];
      for (const [profile, pts] of Object.entries(option.points)) {
        scores[profile] += pts;
      }
    }

    // Find max score(s)
    const maxScore = Math.max(...Object.values(scores));
    const topProfiles = Object.entries(scores)
      .filter(([_, score]) => score === maxScore)
      .map(([profile]) => profile);

    // If multiple top profiles, pick first (or you can customize)
    const topProfile = topProfiles[0];

    setResult({
      profile: topProfile,
      score: maxScore,
    });
  }

  function handleReset() {
    setAnswers({});
    setResult(null);
  }

  return (
    <div style={{ maxWidth: 700, margin: "auto", fontFamily: "Arial, sans-serif", padding: 20 }}>
      <h1>Bio-Rhythm Assessment</h1>
      {!result && (
        <form onSubmit={handleSubmit}>
          {questions.map((q) => (
            <div key={q.id} style={{ marginBottom: 25 }}>
              <h3>{q.text}</h3>
              {q.options.map((opt, i) => (
                <label key={i} style={{ display: "block", marginBottom: 6, cursor: "pointer" }}>
                  <input
                    type="radio"
                    name={q.id}
                    value={i}
                    checked={answers[q.id] === i}
                    onChange={() => handleChange(q.id, i)}
                    required
                    style={{ marginRight: 8 }}
                  />
                  {opt.text}
                </label>
              ))}
              <hr />
            </div>
          ))}
          <button type="submit" style={{ padding: "10px 20px", fontSize: 16, cursor: "pointer" }}>
            See My Profile
          </button>
        </form>
      )}

      {result && (
        <div style={{ marginTop: 30, padding: 20, border: "1px solid #ccc", borderRadius: 8, backgroundColor: "#f9f9f9" }}>
          <h2>Your Bio-Rhythm Type:</h2>
          <h3 style={{ color: "#2c3e50" }}>{profiles[result.profile].name}</h3>
          <ul>
            {profiles[result.profile].description.map((line, idx) => (
              <li key={idx} style={{ marginBottom: 8 }}>
                {line}
              </li>
            ))}
          </ul>
          <button onClick={handleReset} style={{ marginTop: 20, padding: "8px 16px", cursor: "pointer" }}>
            Retake Assessment
          </button>
        </div>
      )}
    </div>
  );
}