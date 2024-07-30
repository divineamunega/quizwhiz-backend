import { Router } from "express";
import { createQuestions, createQuiz } from "../controllers/QuizController";
import { protect } from "../controllers/AuthController";
import {
	createQuizValidator,
	createQuestionValidator,
} from "../validators/QuizValidators";

const router = Router();

router.post("/", createQuizValidator(), protect, createQuiz);
router.post(
	"/:id/question",
	createQuestionValidator(),
	protect,
	createQuestions
);

export default router;
