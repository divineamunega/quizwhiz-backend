import { validationResult } from "express-validator";
import AsyncErrorHandler from "../errors/AsyncErrorHandler";

const signup = AsyncErrorHandler(async (req, res, next) => {
	const response = validationResult(req);
	console.log(response);
	res.json({ message: "Hello" });
});

const login = AsyncErrorHandler(async (req, res, next) => {});

const protect = AsyncErrorHandler(async (req, res, next) => {});

export { signup, login, protect };
