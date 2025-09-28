// backend/streak/controller/streakCount.controller.js (not used in router, but included)
const pool = require("../../config/db");


const streakCountController = async (req, res) => {
  const userId = req.user.id;
  
  try {
    // Get the user's current streak
    const streakResult = await pool.query(
      "SELECT * FROM streaks WHERE user_id = $1",
      [userId]
    );

    let streakCount = 0;
    let lastCompleted = null;

    if (streakResult.rows.length > 0) {
      streakCount = streakResult.rows[0].streak_count;
      lastCompleted = streakResult.rows[0].last_completed;
    }

    const now = new Date();
    let newStreakCount = streakCount;

    if (lastCompleted) {
      const lastDate = new Date(lastCompleted);
      const diffDays = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) newStreakCount += 1;
      else if (diffDays > 1) newStreakCount = 1; // break streak
    } else {
      newStreakCount = 1; // first completion
    }

    if (streakResult.rows.length > 0) {
      await pool.query(
        "UPDATE streaks SET streak_count = $1, last_completed = $2 WHERE user_id = $3",
        [newStreakCount, now, userId]
      );
    } else {
      await pool.query(
        "INSERT INTO streaks (user_id, streak_count, last_completed) VALUES ($1, $2, $3)",
        [userId, newStreakCount, now]
      );
    }

    res.status(200).json({ streakCount: newStreakCount, lastCompleted: now });
  } catch (error) {
    console.error("Error updating streak:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = {streakCountController}