import { Router } from "express";
import { loginValidator, signupValidator } from "../validators/AuthValidators";
import { signup } from "../controllers/AuthController";

const router = Router();

router.post("/signup", signupValidator(), signup);
router.post("/login", loginValidator());

export default router;
