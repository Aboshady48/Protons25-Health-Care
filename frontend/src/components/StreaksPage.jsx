import React, { useState, useEffect } from "react";
import "../Style/StreaksPage.css";

const StreaksPage = () => {
  const [streak, setStreak] = useState(0);
  const [lastCompleted, setLastCompleted] = useState(null);

  useEffect(() => {
    
    const savedStreak = localStorage.getItem("streak");
    const savedLast = localStorage.getItem("lastCompleted");

    if (savedStreak) setStreak(parseInt(savedStreak, 10));
    if (savedLast) setLastCompleted(savedLast);
  }, []);

  const handleCompleteTask = () => {
    const today = new Date().toISOString().split("T")[0]; 

    if (lastCompleted === today) {
      alert("You already logged a task today!");
      return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    let newStreak = 1; 

    if (lastCompleted === yesterdayStr) {
      newStreak = streak + 1;
    }

    setStreak(newStreak);
    setLastCompleted(today);
    
    localStorage.setItem("streak", newStreak);
    localStorage.setItem("lastCompleted", today);
  };

  const handleReset = () => {
    setStreak(0);
    setLastCompleted(null);
    localStorage.removeItem("streak");
    localStorage.removeItem("lastCompleted");
  };

  return (
    <div className="streaks-container">
      <h2>🔥 Your Streaks</h2>
      <p>Current streak: <strong>{streak}</strong> days</p>
      <p>
        {lastCompleted
          ? `Last completed on: ${lastCompleted}`
          : "No streak yet. Start today!"}
      </p>

      <button onClick={handleCompleteTask}>✅ Mark Task Completed Today</button>
      <button onClick={handleReset}>❌ Reset Streak</button>
    </div>
  );
};

export default StreaksPage;
