const pool = require("../../config/db");

const signYourMoodController = async (req, res) => {
  const { mood, intensity, task_id, notes } = req.body;
  const userId = req.user.id;

  // Validate inputs before DB query
  const validMoods = ["Happy", "Sad", "Anxious", "Neutral", "Excited", "Stressed"];
  if (!validMoods.includes(mood)) {
    return res.status(400).json({ error: "Invalid mood value" });
  }

  if (intensity < 1 || intensity > 10) {
    return res.status(400).json({ error: "Intensity must be between 1 and 10" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO mood_tracker (user_id, mood, intensity, task_id, notes) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [userId, mood, intensity, task_id || null, notes || null]
    );

    res.status(201).json({
      message: "Mood recorded successfully",
      moodEntry: result.rows[0],
    });
  } catch (error) {
    console.error("Error recording mood:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { signYourMoodController };
