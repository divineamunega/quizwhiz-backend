import { Router } from "express";
import {
	createQuestions,
	createQuiz,
	getAllCreatedQuizzes,
	getQuiz,
	startLoby,
} from "../controllers/QuizController";
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

router.get("/:id", protect, getQuiz);
router.get("/", protect, getAllCreatedQuizzes);
router.patch("/:id", protect, startLoby);
export default router;
