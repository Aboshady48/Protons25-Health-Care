import React, { useState } from "react";
import axios from "axios";
import '../../Style/Mood.css';

export const AddYourMood = () => {
  const [mood, setMood] = useState("");
  const [intensity, setIntensity] = useState(5);
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/mood/add",
        { mood, intensity, notes },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Mood recorded successfully:", response.data);
      alert("Mood recorded successfully!");
    } catch (err) {
      console.error("Error recording mood:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Failed to record mood!");
    }
  };

  return (
    <div className="Mood-container">
      <h2 className="Mood-title">Add Your Mood</h2>
      <div className="Mood-form">
        <select
          className="Mood-select"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          required
        >
          <option value="" disabled>
            Select your mood
          </option>
          <option value="Happy">Happy</option>
          <option value="Sad">Sad</option>
          <option value="Anxious">Anxious</option>
          <option value="Neutral">Neutral</option>
          <option value="Excited">Excited</option>
          <option value="Stressed">Stressed</option>
        </select>
        <div>
          <label>Intensity: {intensity}</label>
          <input
            className="Mood-input"
            type="range"
            min="1"
            max="10"
            value={intensity}
            onChange={(e) => setIntensity(e.target.value)}
          />
        </div>
        <textarea
          className="Mood-textarea"
          placeholder="Additional notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        ></textarea>
        <button type="submit" className="Mood-button" onClick={handleSubmit}>
          Submit Mood
        </button>
      </div>
    </div>
  );
};