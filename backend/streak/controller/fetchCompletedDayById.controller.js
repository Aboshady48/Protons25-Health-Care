// backend/streak/controller/fetchCompletedDayById.controller.js (no changes)
const pool = require("../../config/db");

const fetchCompletedDayByIdController = async (req, res) => {
  const userId = req.user.id;
  const { date } = req.params; // Expecting YYYY-MM-DD

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res
      .status(400)
      .json({ error: "Valid date parameter (YYYY-MM-DD) is required" });
  }

  try {
    const result = await pool.query(
      `SELECT sl.*, t.title, t.description, t.completed
       FROM streak_logs sl
       JOIN tasks t ON sl.task_id = t.id
       WHERE sl.user_id = $1 AND sl.completed_date = $2::date`,
      [userId, date]
    );

    console.log(`Logs for user ${userId} on ${date}:`, result.rows); // Debug log

    return res.status(200).json({
      date,
      count: result.rowCount,
      logs: result.rows,
      message:
        result.rowCount > 0
          ? "Logs fetched successfully"
          : "No logs found for this date",
    });
  } catch (error) {
    console.error("Error in fetchCompletedDayByIdController:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { fetchCompletedDayByIdController };