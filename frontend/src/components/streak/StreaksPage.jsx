import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../Style/StreaksPage.css";
import StreakCalendar from "./StreakCalendar";

const StreaksPage = () => {
  const [streaks, setStreaks] = useState({});
  const [tasks, setTasks] = useState([]);
  const [completedDates, setCompletedDates] = useState([]);
  const [createdAt, setCreatedAt] = useState(null);
  const [analytics, setAnalytics] = useState({
    totalCompletedDays: 0,
    longestStreak: 0,
    averageStreak: 0,
    completionRate: 0,
  });
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchStreaks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/streak/current", {
        headers: { Authorization: `Bearer ${token}` },
      });

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
      const response = await axios.get("http://localhost:5000/api/tasks/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data.tasks || []);
    } catch (error) {
      console.error("Error fetching tasks:", error.response?.data || error.message);
    }
  };

  const fetchCompletedDays = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/streak/completed-days", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dates = response.data.map((d) => new Date(d).toLocaleDateString("en-CA"));
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

  const fetchAnalytics = async () => {
    try {
      setAnalyticsLoading(true);
      const response = await axios.get("http://localhost:5000/api/streak/analytics", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnalytics(response.data);
    } catch (error) {
      console.error("Error fetching analytics:", error.response?.data || error.message);
    } finally {
      setAnalyticsLoading(false);
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
        prev.map((task) => (task.id === taskId ? { ...task, completed: true } : task))
      );

      // Log the completion and update streak
      await axios.post(
        "http://localhost:5000/api/streak/complete",
        { taskId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh streaks, completed days, and analytics
      await Promise.all([fetchStreaks(), fetchCompletedDays(), fetchAnalytics()]);
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

      await Promise.all([fetchCompletedDays(), fetchAnalytics()]);
    } catch (error) {
      console.error("Error resetting streak:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    Promise.all([fetchStreaks(), fetchTasks(), fetchProfile(), fetchCompletedDays(), fetchAnalytics()]);
  }, []);

  const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD

  return (
    <div className="streaks-container">
      <h2 className="page-title">🔥 Your Streaks</h2>

      {/* Analytics Section */}
      <div className="analytics-section">
        <h3>Streak Analytics</h3>
        {analyticsLoading ? (
          <p className="loading">Loading analytics...</p>
        ) : (
          <div className="analytics-grid">
            <div className="analytics-item">
              <h4>Total Completed Days</h4>
              <p>{analytics.totalCompletedDays} days</p>
            </div>
            <div className="analytics-item">
              <h4>Longest Streak</h4>
              <p>{analytics.longestStreak} days</p>
            </div>
            <div className="analytics-item">
              <h4>Average Streak</h4>
              <p>{analytics.averageStreak} days</p>
            </div>
            <div className="analytics-item">
              <h4>Completion Rate</h4>
              <p>{analytics.completionRate}%</p>
            </div>
          </div>
        )}
      </div>

      {/* Tasks Section */}
      {tasks.length > 0 ? (
        <div className="streaks-grid">
          {tasks.map((task) => {
            const streak = streaks[task.id] || {
              streakCount: 0,
              lastCompleted: null,
              title: task.title,
            };
            const isCompletedToday = streak.lastCompleted === today;
            return (
              <div key={task.id} className="streak-item">
                <h3>{streak.title}</h3>
                <p>
                  Current Streak: <strong>{streak.streakCount}</strong> days
                </p>
                <p>
                  Last Completed: {streak.lastCompleted || "Not completed yet"}
                </p>
                <button
                  className={`complete-btn ${isCompletedToday ? "disabled" : ""}`}
                  onClick={() => markTaskCompleted(task.id)}
                  disabled={isCompletedToday}
                >
                  {isCompletedToday ? "Completed Today" : "✅ Mark Completed"}
                </button>
                <button className="reset-btn" onClick={() => resetStreak(task.id)}>
                  ❌ Reset Streak
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="no-tasks">No tasks or streaks yet. Add a task to start your streak!</p>
      )}
      <hr />
      {createdAt && (
        <StreakCalendar token={token} createdAt={createdAt} completedDates={completedDates} />
      )}
    </div>
  );
};

export default StreaksPage;

