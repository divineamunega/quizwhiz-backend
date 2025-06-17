import { Router } from "express";
import { loginValidator, signupValidator } from "@/validators";
import { login, protect, signup, verifyEmail } from "@/controllers/auth";

const router = Router();

router.post("/signup", signupValidator(), signup);
router.post("/login", loginValidator(), login);
router.get("/verify_email", protect, verifyEmail);

export { router as authRouter };
