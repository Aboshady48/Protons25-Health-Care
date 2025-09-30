import React, { useState } from "react";
import "../../Style/CommunityPage.css";

const CommunityPage = ({ totalStars = 5 }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newFeedback, setNewFeedback] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [hover, setHover] = useState(0);

  const handlePublish = () => {
    if (!newFeedback.trim() || newRating === 0) return; 

    const newEntry = {
      text: newFeedback,
      rating: newRating,
      date: new Date().toLocaleString(),
    };
    setFeedbacks([newEntry, ...feedbacks]);
    setNewFeedback("");
    setNewRating(0);
    setHover(0);
    setShowForm(false);
  };

  return (
    <div className="community-page">
      <h2>Our Community Feedback</h2>

      <div className="feedback-list">
        {feedbacks.map((fb, index) => (
          <div key={index} className="feedback-card">
            <div className="stars">
              {[...Array(totalStars)].map((_, i) => (
                <span key={i}>{i < fb.rating ? "⭐" : "☆"}</span>
              ))}
            </div>
            <p>{fb.text}</p>
            <span className="timestamp">{fb.date}</span>
          </div>
        ))}
        {feedbacks.length === 0 && (
          <p className="no-feedback">No feedback yet. Be the first!</p>
        )}
      </div>

      <button className="add-button" onClick={() => setShowForm(true)}>
        ＋
      </button>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>Leave Your Feedback</h3>

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
                  >
                    {starValue <= (hover || newRating) ? "⭐" : "☆"}
                  </button>
                );
              })}
            </div>

            <textarea
              value={newFeedback}
              onChange={(e) => setNewFeedback(e.target.value)}
              placeholder="Write your thoughts..."
              rows="4"
            />

            <div className="modal-actions">
              <button onClick={handlePublish}>Publish</button>
              <button onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityPage;
