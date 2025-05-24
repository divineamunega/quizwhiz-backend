import { NextFunction, Request, Response } from "express";
import { AsyncErrorHandler } from "@/middlewares";

export const getQuiz = AsyncErrorHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		// TODO Functionality
		res.status(201).json({ message: "Hello World" });
	}
);
