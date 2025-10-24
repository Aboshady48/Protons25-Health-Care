const express = require("express");
const questionRouter = express.Router();
const { addQuestions } = require("../controller/addQuestions.controller");
const { getQuestions } = require("../controller/getQuestions.controller");
const authMiddleware = require("../../middleware/auth.middleware");

// Route to add a new question with options
questionRouter.post("/add", authMiddleware, addQuestions);

// Route to get all questions with their options
questionRouter.get("/", authMiddleware, getQuestions);


module.exports = questionRouter;