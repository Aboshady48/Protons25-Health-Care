import React, { useState, useEffect } from "react";
import "../../Style/CommunityPage.css";
import axios from "axios";

const CommunityPage = ({ totalStars = 5 }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newFeedback, setNewFeedback] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch all feedbacks (with username)
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:5000/api/community/feedback",
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : undefined,
            },
          }
        );

        if (response.data && response.data.feedbacks) {
          setFeedbacks(response.data.feedbacks);
        } else {
          console.warn("Unexpected response format:", response.data);
        }
      } catch (error) {
        console.error("❌ Error fetching feedbacks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  // ✅ Handle publishing new feedback
  const handlePublish = async () => {
    if (!newFeedback.trim() || newRating === 0) {
      alert("Please write feedback and select a rating ⭐");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to submit feedback.");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/community/feedback",
        { feedback: newFeedback, rating: newRating },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.feedback) {
        // ✅ Add new feedback instantly to list
        setFeedbacks((prev) => [response.data.feedback, ...prev]);
      }

      setNewFeedback("");
      setNewRating(0);
      setHover(0);
      setShowForm(false);
    } catch (error) {
      console.error("❌ Error submitting feedback:", error);
      alert("Failed to submit feedback. Please try again.");
    }
  };

  return (
    <div className="community-page">
      <h2>🌍 Our Community Feedback</h2>

      {/* ✅ Loading state */}
      {loading ? (
        <p className="loading-text">Loading feedback...</p>
      ) : (
        <div className="feedback-list">
          {feedbacks.length > 0 ? (
            feedbacks.map((fb) => (
              <div key={fb.id} className="feedback-card">
                <h4 className="username">{fb.username || "Anonymous"}</h4>
                <div className="stars">
                  {[...Array(totalStars)].map((_, i) => (
                    <span key={i}>{i < fb.rating ? "⭐" : "☆"}</span>
                  ))}
                </div>
                <p className="feedback-text">{fb.feedback}</p>
                <span className="timestamp">
                  {fb.created_at
                    ? new Date(fb.created_at).toLocaleString()
                    : ""}
                </span>
              </div>
            ))
          ) : (
            <p className="no-feedback">No feedback yet. Be the first!</p>
          )}
        </div>
      )}

      {/* ➕ Add Feedback Button */}
      <button className="add-button" onClick={() => setShowForm(true)}>
        ＋
      </button>

      {/* 📝 Modal form */}
      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>💬 Leave Your Feedback</h3>

            {/* ⭐ Rating Stars */}
            <div className="rating-stars">
              {[...Array(totalStars)].map((_, index) => {
                const starValue = index + 1;
                return (
                  <button
                    key={starValue}
                    type="button"
                    onClick={() => setNewRating(starValue)}
                    onMouseEnter={() => setHover(starValue)}
                    onMouseLeave={() => setHover(0)}
                    className="star-button"
                  >
                    {starValue <= (hover || newRating) ? "⭐" : "☆"}
                  </button>
                );
              })}
            </div>

            {/* 💬 Feedback textarea */}
            <textarea
              value={newFeedback}
              onChange={(e) => setNewFeedback(e.target.value)}
              placeholder="Write your thoughts..."
              rows="4"
            />

            <div className="modal-actions">
              <button onClick={handlePublish} className="publish-btn">
                Publish
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityPage;
