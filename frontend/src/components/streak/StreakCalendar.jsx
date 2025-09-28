// StreakCalendar.jsx (updated to accept completedDates as prop)
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../Style/StreaksPage.css";
import { SingleStreak } from "./SingleStreak";

const StreakCalendar = ({ completedDates: propCompletedDates, createdAt: propCreatedAt, token: propToken }) => {
  const [completedDates, setCompletedDates] = useState(propCompletedDates || []);
  const [selectedDay, setSelectedDay] = useState(null);
  const [createdAt, setCreatedAt] = useState(propCreatedAt || null);
  const token = propToken || localStorage.getItem("token");

  // Fetch profile to get account creation date (only if not provided)
  const fetchProfile = async () => {
    if (propCreatedAt) return;
    try {
      const response = await axios.get("http://localhost:5000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data?.created_at) {
        setCreatedAt(response.data.created_at.split("T")[0]); // YYYY-MM-DD
      }
    } catch (error) {
      console.error("Error fetching profile:", error.response?.data || error.message);
    }
  };

  // Fetch completed days only if not provided as prop
  const fetchCompletedDays = async () => {
    if (propCompletedDates) return;
    try {
      const response = await axios.get(
        "http://localhost:5000/api/streak/completed-days",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const dates = response.data.map((d) =>
        new Date(d).toLocaleDateString("en-CA") // YYYY-MM-DD
      );
      setCompletedDates(dates);
    } catch (error) {
      console.error("Error fetching completed days:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchCompletedDays();
    fetchProfile();
  }, []);

  // Generate current month calendar
  const generateCalendar = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    const calendarDays = [];
    for (let i = 0; i < firstDay; i++) calendarDays.push(null);
    for (let day = 1; day <= lastDate; day++) {
      calendarDays.push(new Date(year, month, day));
    }
    return calendarDays;
  };

  const calendarDays = generateCalendar();

  const handleDayClick = (dateStr, completed) => {
    if (completed) {
      setSelectedDay(dateStr);
    }
  };

  return (
    <div className="streaks-container">
      <h2>Your Streak Calendar</h2>

      {/* Legend */}
      <div className="streaks-grid">
        <div className="streak-item completed-card">
          <h3>Completed</h3>
          <p>Days where you finished your tasks.</p>
        </div>
        <div className="streak-item active-card">
          <h3>Account Active</h3>
          <p>Days after account creation but without completion.</p>
        </div>
        <div className="streak-item inactive-card">
          <h3>Not Yet Started</h3>
          <p>Before you created your account.</p>
        </div>
      </div>

      {/* Calendar */}
      <div className="calendar-grid">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="calendar-day header">
            {d}
          </div>
        ))}

        {calendarDays.map((date, idx) => {
          if (!date) return <div key={idx} className="calendar-day empty"></div>;

          const dateStr = date.toLocaleDateString("en-CA");
          const completed = completedDates.includes(dateStr);

          let dayClass = "";
          if (completed) {
            dayClass = "completed";
          } else if (createdAt && dateStr >= createdAt) {
            dayClass = "active";
          } else {
            dayClass = "inactive";
          }

          return (
            <div
              key={idx}
              className={`calendar-day ${dayClass}`}
              onClick={() => handleDayClick(dateStr, completed)}
            >
              {date.getDate()}
            </div>
          );
        })}
      </div>

      {/* Show streak details */}
      {selectedDay && (
        <div className="day-logs">
          <button onClick={() => setSelectedDay(null)} style={{ marginBottom: "10px" }}>
            Close
          </button>
          <SingleStreak date={selectedDay} />
        </div>
      )}
    </div>
  );
};

export default StreakCalendar;