import { Router } from "express";
import { loginValidator, signupValidator } from "@/validators";
import {
	login,
	protect,
	refresh,
	signup,
	verifyEmail,
} from "@/controllers/auth";

const router = Router({ caseSensitive: false });

router.post("/signup", signupValidator(), signup);
router.post("/login", loginValidator(), login);
router.get("/verify_email", protect, verifyEmail);
router.get("/refresh", refresh);

export { router as authRouter };
