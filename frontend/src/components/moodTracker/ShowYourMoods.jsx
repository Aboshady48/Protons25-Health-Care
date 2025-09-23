import React, { useEffect, useState } from "react";
import axios from "axios";
import '../../Style/Mood.css';

export const ShowYourMoods = () => {
  const [moods, setMoods] = useState([]);

  useEffect(() => {
    const fetchMoods = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          "http://localhost:5000/api/mood/me",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMoods(response.data.moods);
      } catch (err) {
        console.error("Error fetching moods:", err.response?.data || err.message);
        alert(err.response?.data?.error || "Failed to fetch moods!");
      }
    };

    fetchMoods();
  }, []);

  return (
    <div className="Mood-list-container">
      <h2 className="Mood-title">Your Moods</h2>
      <div>
        {moods.length === 0 ? (
          <p className="Mood-empty">No moods recorded yet.</p>
        ) : (
          <ul className="Mood-list">
            {moods.map((moodEntry) => (
              <li key={moodEntry.id} className="Mood-item">
                <div className="Mood-preview">
                  <div className="Mood-header">
                    <span className="Mood-title-text">{moodEntry.mood}</span>
                    <span className="Mood-id">#{moodEntry.id}</span>
                  </div>
                  <div className="Mood-meta">
                    <span
                      className={`Mood-intensity ${
                        moodEntry.intensity >= 8
                          ? "intensity-high"
                          : moodEntry.intensity >= 5
                          ? "intensity-medium"
                          : "intensity-low"
                      }`}
                    >
                      Intensity: {moodEntry.intensity}
                    </span>
                  </div>
                  {moodEntry.notes && (
                    <div className="Mood-details">
                      <strong>Notes:</strong> {moodEntry.notes}
                    </div>
                  )}
                  <div className="Mood-details">
                    <strong>Date:</strong>{" "}
                    {new Date(moodEntry.recorded_at).toLocaleString()}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};