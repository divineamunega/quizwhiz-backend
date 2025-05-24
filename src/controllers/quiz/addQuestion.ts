import { NextFunction, Request, Response } from "express";
import { AsyncErrorHandler } from "@/middlewares";

export const addQuestion = AsyncErrorHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		// TODO Functionality ISRAEL
        
		res.status(201).json({ message: "Hello World" });
	}
);
