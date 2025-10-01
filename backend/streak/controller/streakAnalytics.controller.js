const pool = require("../../config/db");

const streakAnalyticsController = async (req, res) => {
  const userId = req.user.id;

  try {
    // Get total completed days (unique dates from streak_logs)
    const completedDaysResult = await pool.query(
      `SELECT COUNT(DISTINCT completed_date) as total_completed_days
       FROM streak_logs 
       WHERE user_id = $1`,
      [userId]
    );
    const totalCompletedDays = parseInt(completedDaysResult.rows[0].total_completed_days) || 0;

    // Get longest streak and average streak length
    const streaksResult = await pool.query(
      `SELECT streak_count 
       FROM streaks 
       WHERE user_id = $1`,
      [userId]
    );
    const streakCounts = streaksResult.rows.map((row) => row.streak_count);
    const longestStreak = streakCounts.length > 0 ? Math.max(...streakCounts) : 0;
    const averageStreak =
      streakCounts.length > 0
        ? (streakCounts.reduce((sum, count) => sum + count, 0) / streakCounts.length).toFixed(1)
        : 0;

    // Get account creation date to calculate active days
    const userResult = await pool.query(
      `SELECT created_at 
       FROM users 
       WHERE id = $1`,
      [userId]
    );
    const createdAt = userResult.rows[0]?.created_at;
    let completionRate = 0;

    if (createdAt) {
      const now = new Date();
      const diffDays = Math.floor((now - new Date(createdAt)) / (1000 * 60 * 60 * 24)) + 1; // Include today
      completionRate = diffDays > 0 ? ((totalCompletedDays / diffDays) * 100).toFixed(1) : 0;
    }

    return res.status(200).json({
      totalCompletedDays,
      longestStreak,
      averageStreak,
      completionRate,
    });
  } catch (error) {
    console.error("Error in streakAnalyticsController:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { streakAnalyticsController };