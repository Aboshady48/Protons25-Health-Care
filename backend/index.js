const express = require("express");
require("dotenv").config();
const cors = require("cors");
const pool = require("./config/db");

const authRouter = require("./auth/router/auth.router");
const taskRouter = require("./dailyPlanner/router/tasks.router");
const MoodRouter = require("./moodTracker/router/moodAndEnergy.router");
const streakRouter = require("./streak/router/index");
const communityRouter = require("./community/community.router");
const questionRouter = require("./questions/router/questions.router");
const bioRouter = require("./biorhythm/router/biorhythm.router");
const aiRouter = require("./ai/router/ai.router"); // 👈 added this line

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/mood", MoodRouter);
app.use("/api/streak", streakRouter);
app.use("/api/community", communityRouter);
app.use("/api/questions", questionRouter);
app.use("/api/biorhythm", bioRouter);
app.use("/api/ai", aiRouter); // 👈 mounted AI route here

app.listen(PORT, () => {
  console.log(`✅ Server is running on: http://localhost:${PORT}`);
});
