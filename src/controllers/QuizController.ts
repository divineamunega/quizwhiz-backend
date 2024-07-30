import { Response, Request, NextFunction } from "express";
import prisma from "../prisma";
import AsyncErrorHandler from "../errors/AsyncErrorHandler";

// JUst testing randome stuff
const createQuiz = AsyncErrorHandler(async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { name: quizName, description: quizDescription } = req.data;
	const quiz = await prisma.quiz.create({
		data: {
			name: quizName,
			description: quizDescription,
			status: "IDLE",
			creatorId: req.user!.id,
		},
	});

	res.status(200).json({
		status: "successful",
		data: {
			id: quiz.id,
			creatorId: quiz.creatorId,
			name: quiz.name,
			description: quiz.description,
			status: quiz.status,
			numberOfQuestions: quiz.numberOfQuestions,
			createdAt: quiz.createdAt,
		},
	});
});

export { createQuiz };
