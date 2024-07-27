import { Router } from "express";
import { createQuiz } from "../controllers/QuizController";

const router = Router();

router.post("/quiz", createQuiz);

export default router;
