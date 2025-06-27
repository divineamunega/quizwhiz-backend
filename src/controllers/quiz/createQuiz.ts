import { NextFunction, Request, Response } from "express";
import { AsyncErrorHandler } from "@/middlewares";
import { prisma } from "@/lib";

export const createQuiz = AsyncErrorHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const { title, description, tags } = req.data;
		const user = req.user!;

		const quiz = await prisma.quiz.create({
			data: {
				creatorId: user.id,
				title,
				description,
				tags: tags && tags.length > 0 ? tags : [],
			},
		});

		res.status(201).json({
			status: "success",
			data: {
				id: quiz.id,
				title: quiz.title,
				image: quiz.image ? quiz.image : undefined,
				description: quiz.description,
				createdAt: quiz.createdAt,
				tags: quiz.tags.length > 0 ? quiz.tags : undefined,
				visibility: quiz.visibility,
			},
		});
	}
);
