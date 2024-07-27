import { Router } from "express";
import { signupValidator } from "../validators/AuthValidators";
import { signup } from "../controllers/AuthController";

const router = Router();

router.post("/signup", signupValidator(), signup);

export default router;
