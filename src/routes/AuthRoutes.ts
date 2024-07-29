import { Router } from "express";
import { loginValidator, signupValidator } from "../validators/AuthValidators";
import { login, signup } from "../controllers/AuthController";

const router = Router();

router.post("/signup", signupValidator(), signup);
router.post("/login", loginValidator(), login);

export default router;
