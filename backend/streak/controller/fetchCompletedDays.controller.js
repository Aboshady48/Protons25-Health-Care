// backend/streak/controller/fetchCompletedDays.controller.js (no changes)
const pool = require("../../config/db");

const fetchCompletedDaysController = async (req, res) => {
    const userId = req.user.id;
    
    try {
        const result = await pool.query(
            `SELECT DISTINCT completed_date 
             FROM streak_logs 
             WHERE user_id = $1 
             ORDER BY completed_date DESC`,
            [userId]
        );
        const dates = result.rows.map(row => row.completed_date);
        return res.status(200).json(dates);
    }
    catch (error) {
        console.error("Error in fetchCompletedDaysController:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
module.exports = { fetchCompletedDaysController };