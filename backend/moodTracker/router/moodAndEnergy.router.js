const express = require("express");
const MoodRouter = express.Router();
const { signYourMoodController } = require("../controller/sginYourMood.controller");
const { getAllMoods } = require("../controller/getAllmoods.controller");
const { getTheUserMoodByidController } = require("../controller/getTheUserMoodByid.controller");
const authMiddleware = require("../../middleware/auth.middleware");

// Record a mood
MoodRouter.post("/add", authMiddleware, signYourMoodController);

// Get all moods (admin only)
MoodRouter.get("/all", authMiddleware, getAllMoods);

// ✅ Get moods for logged-in user
MoodRouter.get("/me", authMiddleware, getTheUserMoodByidController);

module.exports = MoodRouter;
