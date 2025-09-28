// StreaksPage.jsx (updated markTaskCompleted to call /streak/complete, added fetchCompletedDays)
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../Style/StreaksPage.css";
import StreakCalendar from "./StreakCalendar";

const StreaksPage = () => {
  const [streaks, setStreaks] = useState({});
  const [tasks, setTasks] = useState([]);
  const [completedDates, setCompletedDates] = useState([]);
  const [createdAt, setCreatedAt] = useState(null);
  const token = localStorage.getItem("token");

  const fetchStreaks = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/streak/current",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const streakData = {};
      response.data.forEach((s) => {
        streakData[s.task_id] = {
          streakCount: s.streak_count,
          lastCompleted: s.last_completed?.split("T")[0] || null,
          title: s.title,
        };
      });
      setStreaks(streakData);
    } catch (error) {
      console.error("Error fetching streaks:", error.response?.data || error.message);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/tasks/all",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(response.data.tasks || []);
    } catch (error) {
      console.error("Error fetching tasks:", error.response?.data || error.message);
    }
  };

  const fetchCompletedDays = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/streak/completed-days",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const dates = response.data.map((d) =>
        new Date(d).toLocaleDateString("en-CA")
      );
      setCompletedDates(dates);
    } catch (error) {
      console.error("Error fetching completed days:", error.response?.data || error.message);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCreatedAt(response.data.created_at.split("T")[0]); // YYYY-MM-DD
    } catch (error) {
      console.error("Error fetching profile:", error.response?.data || error.message);
    }
  };

  const markTaskCompleted = async (taskId) => {
    try {
      // Update task completed status
      await axios.put(
        `http://localhost:5000/api/tasks/${taskId}`,
        { completed: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, completed: true } : task
        )
      );

      // Log the completion and update streak (via backend)
      await axios.post(
        "http://localhost:5000/api/streak/complete",
        { taskId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh streaks and completed days
      await fetchStreaks();
      await fetchCompletedDays();
    } catch (error) {
      console.error("Error marking task completed:", error.response?.data || error.message);
    }
  };

  const resetStreak = async (taskId) => {
    try {
      await axios.post(
        "http://localhost:5000/api/streak/reset",
        { taskId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setStreaks((prev) => ({
        ...prev,
        [taskId]: { streakCount: 0, lastCompleted: null, title: prev[taskId].title },
      }));

      // Refresh completed days after reset (in case it affects)
      await fetchCompletedDays();
    } catch (error) {
      console.error("Error resetting streak:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchStreaks();
    fetchTasks();
    fetchProfile();
    fetchCompletedDays();
  }, []);

  const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD

  return (
    <div className="streaks-container">
      <h2>🔥 Your Streaks</h2>
      {tasks.length > 0 ? (
        <div className="streaks-grid">
          {tasks.map((task) => {
            const streak = streaks[task.id] || { streakCount: 0, lastCompleted: null, title: task.title };
            const isCompletedToday = streak.lastCompleted === today;
            return (
              <div key={task.id} className="streak-item">
                <h3>Task: {streak.title}</h3>
                <p>Current streak: <strong>{streak.streakCount}</strong> days</p>
                <p>
                  {streak.lastCompleted
                    ? `Last completed on: ${streak.lastCompleted}`
                    : "Not completed yet"}
                </p>
                <button
                  className={`completed ${isCompletedToday ? "disabled" : ""}`}
                  onClick={() => markTaskCompleted(task.id)}
                  disabled={isCompletedToday}
                >
                  {isCompletedToday ? "Completed Today" : "✅ Mark Completed"}
                </button>
                <button className="reset" onClick={() => resetStreak(task.id)}>
                  ❌ Reset Streak
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No tasks or streaks yet. Add a task to start your streak!</p>
      )}
      <hr />
      {createdAt && <StreakCalendar token={token} createdAt={createdAt} completedDates={completedDates} />}
    </div>
  );
};

export default StreaksPage;