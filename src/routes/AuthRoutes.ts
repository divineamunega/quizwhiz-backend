import { Router } from "express";
import { loginValidator, signupValidator } from "../validators/AuthValidators";
import {
	loggedIn,
	login,
	protect,
	signup,
} from "../controllers/AuthController";

const router = Router();

router.post("/signup", signupValidator(), signup);
router.post("/login", loginValidator(), login);
router.get("/check", protect, loggedIn);

export default router;
