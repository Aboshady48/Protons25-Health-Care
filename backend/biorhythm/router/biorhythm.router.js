const express = require('express');
const bioRouter = express.Router();
const { addBiorhythm, getBiorhythms } = require('../controller/saveBiorhythm.controller');
const {getBiorhythmQuestions , addBiorhythmQuestions , saveBiorhythmResult} = require('../controller/biorithm.questions.controller');
const {getProfiles} = require('../controller/biorithm.profile.controller');
const authMiddleware = require('../../middleware/auth.middleware');

// Add new biorhythm result
bioRouter.post('/add', authMiddleware, addBiorhythm);

// Get all results for logged-in user
bioRouter.get('/', authMiddleware, getBiorhythms);

// Add Biorhythm questions (with points) - Admin only
bioRouter.post('/questions/add', authMiddleware, addBiorhythmQuestions);

// Get all Biorhythm questions with options
bioRouter.get('/questions', authMiddleware, getBiorhythmQuestions);

// Save Biorhythm test result
bioRouter.post('/questions/result', authMiddleware, saveBiorhythmResult);

// Get all Biorhythm profiles

bioRouter.get('/profiles', authMiddleware, getProfiles);

module.exports = bioRouter;
