// backend/streak/controller/getUserStreak.controller.js (no changes)
const pool = require("../../config/db");

const getCurrentStreak = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT s.*, t.title 
       FROM streaks s 
       JOIN tasks t ON s.task_id = t.id 
       WHERE s.user_id = $1 
       ORDER BY s.last_completed DESC`,
      [userId]
    );

    const now = new Date();
    const updatedStreaks = await Promise.all(
      result.rows.map(async (streak) => {
        if (streak.last_completed) {
          const lastDate = new Date(streak.last_completed);
          const diffDays = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));
          if (diffDays > 1) {
            await pool.query(
              "UPDATE streaks SET streak_count = 0, last_completed = NULL WHERE user_id = $1 AND task_id = $2",
              [userId, streak.task_id]
            );
            return { ...streak, streak_count: 0, last_completed: null };
          }
        }
        return streak;
      })
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No streaks found for this user." });
    }

    res.status(200).json(updatedStreaks);
  } catch (error) {
    console.error("Error fetching streak:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getCurrentStreak };