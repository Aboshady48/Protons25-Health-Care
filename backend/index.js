const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 5000;
const pool = require("./config/db");
const authRouter = require("./auth/router/auth.router");
const taskRouter = require("./dailyPlanner/router/tasks.router");
const MoodRouter = require("./moodTracker/router/moodAndEnergy.router");
const cors = require("cors");
const streakRouter = require("./streak/router/index");
const communityRouter = require("./community/community.router");


//cors
app.use(cors(
  {
    origin: "http://localhost:5173",
    credentials: true
  }
));

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/mood", MoodRouter);
app.use("/api/streak",streakRouter);
app.use("/api/community", communityRouter);



app.listen(PORT, () => {
  console.log(`Server is running on: http://localhost:${PORT}`);
});
