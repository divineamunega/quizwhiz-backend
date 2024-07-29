import { Router } from "express";
import { createQuiz } from "../controllers/QuizController";
import { protect } from "../controllers/AuthController";

const router = Router();

router.post("/", protect, createQuiz);

export default router;
