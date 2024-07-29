import { Response, Request, NextFunction } from "express";
// import prisma from "../prisma";

// JUst testing randome stuff
const createQuiz = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	res.status(200).json({
		message: "Hello from the create Quiz",
	});
};

export { createQuiz };
