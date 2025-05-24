import { Router } from "express";

import { addQuestion, createQuiz, getQuiz } from "@/controllers/quiz";
// TODO Divine: Implement the protect functionality
// import { protect } from "../controllers/AuthController";
import {
	createQuizValidator,
	addQuestionValidator,
} from "@/validators/QuizValidators";

const router = Router();

router.post("/", createQuizValidator(), createQuiz);
router.post("/:id/question", addQuestionValidator(), addQuestion);

router.get("/:id", getQuiz);

export { router as quizRouter };
