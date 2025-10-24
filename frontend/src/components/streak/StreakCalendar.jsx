import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../Style/StreaksPage.css";
import { SingleStreak } from "./SingleStreak";

const StreakCalendar = ({ completedDates: propCompletedDates, createdAt: propCreatedAt, token: propToken }) => {
  const [completedDates, setCompletedDates] = useState(propCompletedDates || []);
  const [selectedDay, setSelectedDay] = useState(null);
  const [createdAt, setCreatedAt] = useState(propCreatedAt || null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const token = propToken || localStorage.getItem("token");

  const fetchProfile = async () => {
    if (propCreatedAt) return;
    try {
      const response = await axios.get("http://localhost:5000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data?.created_at) {
        setCreatedAt(response.data.created_at.split("T")[0]); 
      }
    } catch (error) {
      console.error("Error fetching profile:", error.response?.data || error.message);
    }
  };

  const fetchCompletedDays = async () => {
    if (propCompletedDates) return;
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

  useEffect(() => {
    fetchCompletedDays();
    fetchProfile();
  }, []);

  const generateCalendar = () => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();
    const calendarDays = [];

    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(null);
    }
    for (let day = 1; day <= lastDate; day++) {
      calendarDays.push(new Date(currentYear, currentMonth, day));
    }
    return calendarDays;
  };

  const calendarDays = generateCalendar();

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => {
      if (prev === 0) {
        setCurrentYear((year) => year - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => {
      if (prev === 11) {
        setCurrentYear((year) => year + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  const isPrevMonthDisabled = () => {
    if (!createdAt) return true;
    const creationDate = new Date(createdAt);
    const creationYear = creationDate.getFullYear();
    const creationMonth = creationDate.getMonth();
    return currentYear === creationYear && currentMonth <= creationMonth;
  };

  const handleDayClick = (dateStr, completed) => {
    if (completed) {
      setSelectedDay(dateStr);
    }
  };

  const getMonthName = () => {
    return new Date(currentYear, currentMonth).toLocaleString("default", { month: "long" });
  };

  return (
    <div className="streaks-container">
      <h2>Your Streak Calendar</h2>

      <div className="calendar-navigation">
        <button onClick={handlePrevMonth} disabled={isPrevMonthDisabled()}>
          Previous
        </button>
        <h3>
          {getMonthName()} {currentYear}
        </h3>
        <button onClick={handleNextMonth}>Next</button>
      </div>

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
              style={{ cursor: completed ? "pointer" : "default" }}
            >
              {date.getDate()}
            </div>
          );
        })}
      </div>

      {selectedDay && (
        <div className="day-logs">
          <button onClick={() => setSelectedDay(null)} className="close-button">
            Close
          </button>
          <SingleStreak date={selectedDay} />
        </div>
      )}
    </div>
  );
};

export default StreakCalendar;