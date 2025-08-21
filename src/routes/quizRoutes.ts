import { Router } from "express";

import {
	addQuestion,
	createQuiz,
	getQuestions,
	getQuiz,
	removeQuiz,
} from "@/controllers/quiz";
import { protect } from "@/controllers/auth";
import {
	createQuizValidator,
	addQuestionValidator,
} from "@/validators/QuizValidators";

const router = Router();

router.post("/", protect, createQuizValidator(), createQuiz);
router.post("/:id/question", protect, addQuestionValidator(), addQuestion);
router.get("/:id/question", protect, getQuestions);
router.get("/:id/question/:questionId");
router.get("/:id", getQuiz);
router.delete("/:id", protect, removeQuiz);

router.post("/:id/sessions"); // Create a Quiz Session

export { router as quizRouter };
