const pool = require("../../config/db");
/**
 * 
CREATE TABLE mood_tracker (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    mood mood_enum, -- ENUM for consistency
    total_score INT CHECK(total_score BETWEEN 0 AND 30),
    sleep_quality INT CHECK(sleep_quality BETWEEN 0 AND 3),
    safety_level INT CHECK(safety_level BETWEEN 0 AND 3),
    details TEXT,
    safety_message TEXT,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

 */

const signYourMoodController = async (req, res) => {
  const { mood, total_score, sleep_quality, safety_level, details } = req.body;
  const userId = req.user.id; // from JWT
  
  // Basic validation
  if (
    !mood ||
    typeof mood !== "string" ||
    ![ "Happy", "Sad", "Anxious", "Neutral", "Excited", "Stressed"].includes(mood)
  ) {
    return res
      .status(400)
      .json({ error: "Mood is required and must be a valid option." });
  }
  if (
    total_score === undefined ||
    typeof total_score !== "number" ||
    total_score < 0 ||
    total_score > 30
  ) {
    return res
      .status(400)
      .json({ error: "Total score is required and must be between 0 and 30." });
  }
  if (
    sleep_quality === undefined ||
    typeof sleep_quality !== "number" ||
    sleep_quality < 0 ||
    sleep_quality > 3
  ) {
    return res.status(400).json({
      error: "Sleep quality is required and must be between 0 and 3.",
    });
  }
  if (
    safety_level === undefined ||
    typeof safety_level !== "number" ||
    safety_level < 0 ||
    safety_level > 3
  ) {
    return res.status(400).json({
      error: "Safety level is required and must be between 0 and 3.",
    });
  }
  
  try {
    const query = `
            INSERT INTO mood_tracker (user_id, mood, total_score, sleep_quality, safety_level, details)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
    const values = [userId, mood, total_score, sleep_quality, safety_level, details || null];

    const result = await pool.query(query, values);
    res.status(201).json({ 
        message: 'Mood recorded successfully', 
        mood: result.rows[0] 
    });
  } catch (error) {
    console.error('Error recording mood:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { signYourMoodController };
