import { Router } from "express";
import { loginValidator, signupValidator } from "@/validators";
import {
	login,
	protect,
	refresh,
	signup,
	verifyEmail,
	check,
} from "@/controllers/auth";
import { resendVerification } from "@/controllers/auth/resendVerification";

const router = Router({ caseSensitive: false });

router.post("/signup", signupValidator(), signup);
router.post("/login", loginValidator(), login);
router.get("/verify_email", protect, verifyEmail);
router.get("/resend-verification", protect, resendVerification);
router.get("/check", protect, check);
router.get("/refresh", refresh);

export { router as authRouter };
