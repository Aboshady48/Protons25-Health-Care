import React from "react";
import { useNavigate } from "react-router-dom";
import { CalendarCheck2, Smile, HeartPulse } from "lucide-react"; 
import "../Style/Home.css";

export const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1 className="home-title">CATEGORIES</h1>
      <div className="home-buttons">
        
        <div
          className="home-card planner"
          onClick={() => navigate("/tasks")}
        >
          <CalendarCheck2 className="home-icon" />
          <span className="home-label">Daily Planner</span>
        </div>

        <div
          className="home-card mood"
          onClick={() => navigate("/mood")}
        >
          <Smile className="home-icon" />
          <span className="home-label">Mood Tracker</span>
        </div>

        <div
          className="home-card biorhythm"
          onClick={() => navigate("/biorhythm")}
        >
          <HeartPulse className="home-icon" />
          <span className="home-label">Biorhythm</span>
        </div>

      </div>
    </div>
  );
};