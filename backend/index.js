const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const pool = require("./config/db");

// Routers
const authRouter = require("./auth/router/auth.router");
const taskRouter = require("./dailyPlanner/router/tasks.router");
const moodRouter = require("./moodTracker/router/moodAndEnergy.router");
const streakRouter = require("./streak/router/index");
const communityRouter = require("./community/community.router");
const questionRouter = require("./questions/router/questions.router");
const bioRouter = require("./biorhythm/router/biorhythm.router");
const airouter = require("./ai/router/ai.router");
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/mood", moodRouter);
app.use("/api/streak", streakRouter);
app.use("/api/community", communityRouter);
app.use("/api/questions", questionRouter);
app.use("/api/biorhythm", bioRouter);
app.use("/api/ai", airouter); 

// Server
app.listen(PORT, () => {
  console.log(`✅ Server is running on: http://localhost:${PORT}`);
});
