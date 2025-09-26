const express = require('express');
const streakRouter = express.Router();
const authMiddleware = require('../../middleware/auth.middleware');
const { getCurrentStreak } = require('../controller/getUserStreak.controller');
const { RestTheStreak } = require('../controller/RestTheStreak.controller');
const { dayCompletedController } = require('../controller/dayCompleted.controller');
const { fetchCompletedDaysController } = require('../controller/fetchCompletedDays.controller');
const {fetchCompletedDayByIdController} = require('../controller/fetchCompletedDayById.controller');

// Reset the streak to zero
streakRouter.post('/reset', authMiddleware, RestTheStreak);
// Get current streak
streakRouter.get('/current', authMiddleware, getCurrentStreak);
// Mark a day as completed for a task
streakRouter.post('/complete', authMiddleware, dayCompletedController);
// Fetch all completed days for the user
streakRouter.get('/completed-days', authMiddleware, fetchCompletedDaysController);

// Fetch completed days for a specific date
streakRouter.get('/completed-days/date/:date', authMiddleware, fetchCompletedDayByIdController);

module.exports = streakRouter;