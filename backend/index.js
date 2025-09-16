const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 5000;
const pool = require("./config/db");
const authRouter = require("./auth/router/auth.router");
const taskRouter = require("./dailyPlanner/router/tasks.router");
const cors = require("cors");


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



app.listen(PORT, () => {
  console.log(`Server is running on: http://localhost:${PORT}`);
});
