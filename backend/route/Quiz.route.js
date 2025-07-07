import express from 'express';
import quizcontroller  from '../controller/Quiz.controller.js';

const router= express.Router();

router.post("/create", quizcontroller.createQuiz);
router.get("/allquiz",quizcontroller.getQuizzes);

export default router;
