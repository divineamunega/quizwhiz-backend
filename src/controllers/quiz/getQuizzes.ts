import { prisma } from "@/lib";
import { AsyncErrorHandler } from "@/middlewares";
import { Request, Response } from "express";

const getQuizzes = AsyncErrorHandler(async function (
	req: Request,
	res: Response
) {
	const user = req.user!;

	const { search } = req.query;

	const whereClause: any = { creatorId: user.id, isDeleted: false };

	if (search) {
		whereClause.title = {
			contains: search as string,
			mode: 'insensitive',
		};
	}

	const quizes = await prisma.quiz.findMany({
		where: whereClause,
		take: 10,
		orderBy: { createdAt: "desc" },
	});

	const payload = {
		status: "success",
		data: quizes,
	};

	res.status(200).json(payload);
});

export { getQuizzes };
