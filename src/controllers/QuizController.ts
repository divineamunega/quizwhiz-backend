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

const createQuestions = AsyncErrorHandler(async (req, res, next) => {
	const quizId = req.params.id;
	const userId = req.user?.id;
	const data = req.data;

	const newQuestion = await prisma.$transaction(async (prisma) => {
		const newQuestion = prisma.question.create({
			data: {
				question: data.question,
				quizId: quizId,

				answers: {
					create: data.answers.map((answer: any) => {
						return { answer: answer.answer, isCorrect: answer.isCorrect };
					}),
				},
			},
		});

		// UPDATE QUIZ
		await prisma.quiz.update({
			where: { id: quizId },
			data: {
				numberOfQuestions: {
					increment: 1,
				},
			},
		});

		return newQuestion;
	});

	res.status(200).json({
		newQuestion,
		userId,
	});
});

export { createQuiz, createQuestions };
