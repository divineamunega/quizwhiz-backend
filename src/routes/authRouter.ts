import { Router } from "express";
import { loginValidator, signupValidator } from "@/validators";
import {
	login,
	protect,
	refresh,
	signup,
	verifyEmail,
} from "@/controllers/auth";
import { resendVerification } from "@/controllers/auth/resendVerification";

const router = Router({ caseSensitive: false });

router.post("/signup", signupValidator(), signup);
router.post("/login", loginValidator(), login);
router.get("/verify_email", protect, verifyEmail);
router.get("/resend-verfication", protect, resendVerification);
router.get("/refresh", refresh);

export { router as authRouter };
