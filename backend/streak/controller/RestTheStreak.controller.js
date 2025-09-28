const pool = require("../../config/db");

const RestTheStreak = async (req, res) => {
  const userId = req.user.id;
  const { taskId } = req.body || {};

  if (!taskId) return res.status(400).json({ message: "taskId is required" });

  try {
    const streakResult = await pool.query(
      "SELECT * FROM streaks WHERE user_id = $1 AND task_id = $2",
      [userId, taskId]
    );

    if (streakResult.rows.length === 0) {
      return res.status(404).json({ message: "No streak found for this user and task." });
    }

    await pool.query(
      "UPDATE streaks SET streak_count = 0, last_completed = NULL WHERE user_id = $1 AND task_id = $2",
      [userId, taskId]
    );

    res.status(200).json({ message: "Streak has been reset to zero." });
  } catch (error) {
    console.error("Error resetting streak:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { RestTheStreak };