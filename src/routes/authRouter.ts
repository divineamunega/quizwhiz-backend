import { Router } from "express";
import { loginValidator, signupValidator } from "@/validators";
import { login, signup, verifyEmail } from "@/controllers/auth";

const router = Router();

router.post("/signup", signupValidator(), signup);
router.post("/login", loginValidator(), login);
router.get("/verify_email", verifyEmail);

export { router as authRouter };
