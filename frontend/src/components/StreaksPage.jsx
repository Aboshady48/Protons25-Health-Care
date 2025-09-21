import React, { useState, useEffect } from "react";
import "../Style/StreaksPage.css";

const StreaksPage = () => {
  const [streak, setStreak] = useState(0);
  const [lastCompleted, setLastCompleted] = useState(null);

  // Helper to get date string YYYY-MM-DD in local timezone
  const getDateStr = (date = new Date()) => {
    return date.toISOString().split("T")[0];
  };

  // Call this function whenever a task is completed
  const updateStreakOnTaskComplete = () => {
    const today = getDateStr();
    const yesterday = getDateStr(new Date(Date.now() - 86400000)); // 1 day in ms

    if (lastCompleted === today) {
      // Already updated streak today, do nothing
      return;
    }

    let newStreak = 1;
    if (lastCompleted === yesterday) {
      newStreak = streak + 1;
    }

    setStreak(newStreak);
    setLastCompleted(today);
    localStorage.setItem("streak", newStreak);
    localStorage.setItem("lastCompleted", today);
  };

  // On mount, load streak and lastCompleted from localStorage
  useEffect(() => {
    const savedStreak = localStorage.getItem("streak");
    const savedLast = localStorage.getItem("lastCompleted");

    if (savedStreak) setStreak(parseInt(savedStreak, 10));
    if (savedLast) setLastCompleted(savedLast);

    // Check if streak should reset (if lastCompleted is older than yesterday)
    const yesterday = getDateStr(new Date(Date.now() - 86400000));
    if (savedLast && savedLast < yesterday) {
      // Missed a day, reset streak
      setStreak(0);
      setLastCompleted(null);
      localStorage.removeItem("streak");
      localStorage.removeItem("lastCompleted");
    }
  }, []);

  // Expose updateStreakOnTaskComplete to window for demo/testing
  // In your real app, call this function when a task is completed
  useEffect(() => {
    window.updateStreakOnTaskComplete = updateStreakOnTaskComplete;
  }, [streak, lastCompleted]);

  return (
    <div className="streaks-container">
      <h2>🔥 Your Streaks</h2>
      <p>Current streak: <strong>{streak}</strong> days</p>
      <p>
        {lastCompleted
          ? `Last completed on: ${lastCompleted}`
          : "No streak yet. Start today!"}
      </p>

      <button onClick={updateStreakOnTaskComplete}>✅ Mark Task Completed Today</button>
      <button onClick={() => {
        setStreak(0);
        setLastCompleted(null);
        localStorage.removeItem("streak");
        localStorage.removeItem("lastCompleted");
      }}>❌ Reset Streak</button>
    </div>
  );
};

export default StreaksPage;