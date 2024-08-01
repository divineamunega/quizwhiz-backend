import { Response, Request, NextFunction } from "express";
import prisma from "../prisma";
import AsyncErrorHandler from "../errors/AsyncErrorHandler";
import AppError from "../errors/AppError";
import { createUniqueJoinCode } from "../utils/createUniqueJoinCode";
// import { socketServer } from "../server";
// import { socketServer } from "../server";

// JUst testing random stuff
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

	const quiz = await prisma.quiz.findFirst({
		where: { id: quizId, creatorId: userId },
	});

	if (!quiz)
		throw new AppError(
			`This user does not have any quiz with the id ${quizId}.`,
			404
		);

	const { question, answers } = await prisma.$transaction(async (prisma) => {
		// TODO TO make the numberOFQuestions field useful
		const question = await prisma.question.create({
			data: { question: data.question, quizId: quizId },
		});

		await prisma.answer.createMany({
			data: [
				...data.answers.map((obj: any) => {
					return {
						answer: obj.answer,
						isCorrect: obj.isCorrect,
						questionId: question.id,
					};
				}),
			],
		});

		const answers = await prisma.answer.findMany({
			where: { questionId: question.id },
		});
		return { question, answers };
	});

	res.status(201).json({
		id: question.id,
		question: question.question,
		answers: answers.map((answer) => {
			return { answer: answer.answer, isCorrect: answer.isCorrect };
		}),
	});
});

const getQuiz = AsyncErrorHandler(async (req, res, next) => {
	const quizId = req.params.id;
	const userId = req.user!.id;

	const quiz = await prisma.quiz.findFirst({
		where: { id: quizId, creator: { id: userId } },
	});

	if (!quiz)
		throw new AppError(
			`Could not find any quiz with the id ${quizId} in ${
				req.user?.name[0].toUpperCase() + req.user!.name.slice(1)
			}'s list of created quizes.`,
			404
		);

	const questions = await prisma.question.findMany({ where: { quiz: quiz } });
	res.status(200).json({
		status: "success",
		data: {
			quiz: {
				name: quiz.name,
				description: quiz.description,
				numberOfQuestions: questions.length,
				questions: questions.map((question) => {
					return { id: question.id, question: question.question };
				}),
			},
		},
	});
});

const getAllCreatedQuizzes = AsyncErrorHandler(async (req, res, next) => {
	const userId = req.user?.id;

	const quizes = await prisma.quiz.findMany({
		where: { creator: { id: userId } },
	});

	if (quizes.length === 0)
		throw new AppError(
			`${req.user?.name} has not created any quizzes. 😥 send a POST request to /quiz to create one`,
			404
		);

	res.status(200).json({
		status: "success",
		data: {
			quizes: quizes,
		},
	});
});

const startLoby = AsyncErrorHandler(async (req, res, next) => {
	const quizId = req.params.id;
	const userId = req.user!.id;

	const uniqueCode = await createUniqueJoinCode();

	const quiz = await prisma.quiz.update({
		where: { id: quizId, creator: { id: userId } },
		data: { status: "LOBBY", joinCode: uniqueCode },
	});

	if (!quiz)
		throw new AppError(
			`Could not find any quiz with the id ${quizId} in ${
				req.user!.name
			}'s list of created quizes. Send a POST request to /quiz to create one.`,
			404
		);

	res.status(201).json({
		status: "success",
		message: "Your quiz is ready to be joined",
		data: {
			id: quiz.id,
			name: quiz.name,
			description: quiz.description,
			joinCode: quiz.joinCode,
		},
	});
});

// https://quizwhiz-backend.onrender.com
export {
	createQuiz,
	createQuestions,
	getQuiz,
	getAllCreatedQuizzes,
	startLoby,
};
