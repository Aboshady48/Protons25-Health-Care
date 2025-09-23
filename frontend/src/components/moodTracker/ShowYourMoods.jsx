import React, { useEffect, useState } from "react";
import axios from "axios";
import '../../Style/Mood.css';

export const ShowYourMoods = () => {
  const [moods, setMoods] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const moodsPerPage = 5;

  const fetchMoods = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage");
      setMoods([]);
      return;
    }
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
      setMoods(response.data.moods || []);
    } catch (err) {
      console.error("Error fetching moods:", err.response?.data || err.message);
      if (err.response?.status === 404 || err.response?.data?.message === "No moods found for this user") {
        setMoods([]); // Handle no moods case gracefully
      } else {
        alert(err.response?.data?.error || "Failed to fetch moods!");
      }
    }
  };

  useEffect(() => {
    fetchMoods();
    const intervalId = setInterval(fetchMoods, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const totalMoods = moods.length;
  const totalPages = Math.ceil(totalMoods / moodsPerPage);
  const indexOfLastMood = currentPage * moodsPerPage;
  const indexOfFirstMood = indexOfLastMood - moodsPerPage;
  const currentMoods = moods.slice(indexOfFirstMood, indexOfLastMood);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="Mood-list-container">
      <h2 className="Mood-title">Your Moods</h2>
      <div>
        {moods.length === 0 ? (
          <p className="Mood-empty">No moods recorded yet.</p>
        ) : (
          <>
            <ul className="Mood-list">
              {currentMoods.map((moodEntry) => (
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
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              <span className="page-info">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="pagination-btn"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};