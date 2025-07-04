import { Router } from "express";

import { addQuestion, createQuiz, getQuiz } from "@/controllers/quiz";
import { protect } from "@/controllers/auth";
import {
	createQuizValidator,
	addQuestionValidator,
} from "@/validators/QuizValidators";

const router = Router();

router.post("/", protect, createQuizValidator(), createQuiz);
router.post("/:id/question", protect, addQuestionValidator(), addQuestion);

router.get("/:id", getQuiz);

export { router as quizRouter };
