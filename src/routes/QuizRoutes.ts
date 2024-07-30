import { Router } from "express";
import { createQuiz } from "../controllers/QuizController";
import { protect } from "../controllers/AuthController";
import { createQuizValidator } from "../validators/QuizValidators";

const router = Router();

router.post("/", createQuizValidator(), protect, createQuiz);

export default router;
