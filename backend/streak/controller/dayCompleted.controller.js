// backend/streak/controller/dayCompleted.controller.js (added streak update logic)
const pool = require("../../config/db");

const dayCompletedController = async (req, res) => {
    const userId = req.user.id;
    const { taskId, details } = req.body;
    
    if (!taskId) {
        return res.status(400).json({ error: "taskId is required" });
    }
    try {
        const now = new Date();
        const today = now.toISOString().split("T")[0];

        // Check if already logged today
        const existingLog = await pool.query(
            `SELECT * FROM streak_logs 
             WHERE user_id = $1 AND task_id = $2 AND completed_date = $3`,
            [userId, taskId, today]
        );

        if (existingLog.rowCount > 0) {
            return res.status(400).json({ message: "Task already logged as completed today" });
        }
        
        // Insert new log
        const insertLog = await pool.query(
            `INSERT INTO streak_logs (user_id, task_id, completed_date, details)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [userId, taskId, today, details || null]
        );
        if (insertLog.rowCount === 0) {
            return res.status(500).json({ error: "Failed to log completion" });
        }

        // Update streak
        const streakResult = await pool.query(
            'SELECT * FROM streaks WHERE user_id = $1 AND task_id = $2',
            [userId, taskId]
        );

        let streakCount = 0;
        let lastCompleted = null;

        if (streakResult.rows.length > 0) {
            streakCount = streakResult.rows[0].streak_count;
            lastCompleted = streakResult.rows[0].last_completed;
        }

        let newStreakCount = streakCount;

        if (lastCompleted) {
            const lastDate = new Date(lastCompleted);
            const diffDays = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));
            if (diffDays === 1) {
                newStreakCount += 1; // Consecutive day
            } else if (diffDays > 1) {
                newStreakCount = 1; // Break streak
            }
        } else {
            newStreakCount = 1; // First completion
        }

        if (streakResult.rows.length > 0) {
            await pool.query(
                'UPDATE streaks SET streak_count = $1, last_completed = $2 WHERE user_id = $3 AND task_id = $4',
                [newStreakCount, now, userId, taskId]
            );
        } else {
            await pool.query(
                'INSERT INTO streaks (user_id, task_id, streak_count, last_completed) VALUES ($1, $2, $3, $4)',
                [userId, taskId, newStreakCount, now]
            );
        }

        return res.status(201).json({ message: "Task marked as completed for today", log: insertLog.rows[0] });
    } catch (error) {
        console.error("Error in dayCompletedController:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { dayCompletedController };