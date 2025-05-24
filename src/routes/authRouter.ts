import { Router } from "express";
import { loginValidator, signupValidator } from "@/validators";
import { login, signup } from "@/controllers/auth";

const router = Router();

router.post("/signup", signupValidator(), signup);
router.post("/login", loginValidator(), login);

export { router as authRouter };
