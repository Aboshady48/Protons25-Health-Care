const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 5000;
const pool = require("./config/db");
const cors = require("cors");
const authRouter = require("./auth/router/auth.router");
const taskRouter = require("./dailyPlanner/router/tasks.router");
const MoodRouter = require("./moodTracker/router/moodAndEnergy.router");
const streakRouter = require("./streak/router/index");
const aiRouter = require("./ai/router/ai.router"); 


app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/mood", MoodRouter);
app.use("/api/streak", streakRouter);
app.use("/api/ai", aiRouter); 

app.listen(PORT, () => {
  console.log(`✅ Server is running on: http://localhost:${PORT}`);
});