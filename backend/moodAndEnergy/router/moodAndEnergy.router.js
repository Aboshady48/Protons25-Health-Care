const express = require('express');
const MoodRouter = express.Router();
const { getTheUserMoodByidController } = require('../controller/getTheUserMoodByid.controller');
const {sginYourMoodController} = require('../controller/sginYourMood.controller');
const authMiddleware = require('../../middleware/auth.middleware');

MoodRouter.get('/:id', authMiddleware, getTheUserMoodByidController);
MoodRouter.post('/add', authMiddleware, sginYourMoodController);

module.exports = MoodRouter;