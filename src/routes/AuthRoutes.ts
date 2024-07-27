import { Router } from "express";
import { signupValidator } from "../validators/AuthValidators";

const router = Router();

router.post("/auth/signup", signupValidator());

export default router;
