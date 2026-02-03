import { prisma } from "@/lib";
import { AsyncErrorHandler } from "@/middlewares";
import { Request, Response } from "express";

const getPublicQuizzes = AsyncErrorHandler(async function (
	req: Request,
	res: Response
) {
	const { search, category, sortBy, limit = 10, offset = 0 } = req.query;

	const whereClause: any = {
		visibility: "PUBLIC",
		isDeleted: false,
	};

	// Add search filter
	if (search) {
		whereClause.OR = [
			{
				title: {
					contains: search as string,
					mode: "insensitive",
				},
			},
			{
				description: {
					contains: search as string,
					mode: "insensitive",
				},
			},
		];
	}

	// Add category filter (using tags array)
	if (category && category !== "all") {
		whereClause.tags = {
			has: category as string,
		};
	}

	// Determine sort order
	let orderBy: any = { createdAt: "desc" }; // default to most recent

	if (sortBy === "popular") {
		// For now, we'll sort by creation date. In the future, we could add a popularity field
		orderBy = { createdAt: "desc" };
	} else if (sortBy === "questions") {
		// We'll need to count questions, for now use creation date
		orderBy = { createdAt: "desc" };
	}

	const parsedLimit = Number(limit);
	const parsedOffset = Number(offset);
	const takeUncapped =
		Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : 10;
	const take = Math.min(takeUncapped, 20);
	const skip = Number.isFinite(parsedOffset) && parsedOffset >= 0 ? parsedOffset : 0;

	const [total, quizzes] = await prisma.$transaction([
		prisma.quiz.count({ where: whereClause }),
		prisma.quiz.findMany({
		where: whereClause,
		take,
		skip,
		orderBy,
		select: {
			id: true,
			title: true,
			description: true,
			image: true,
			tags: true,
			createdAt: true,
			creator: {
				select: {
					id: true,
					name: true,
				},
			},
			questions: {
				select: {
					id: true,
				},
			},
			_count: {
				select: {
					quizSessions: true,
				},
			},
		},
		}),
	]);

	// Transform the data to match frontend expectations
	const transformedQuizzes = quizzes.map((quiz) => ({
		id: quiz.id,
		title: quiz.title,
		description: quiz.description,
		category: quiz.tags.length > 0 ? quiz.tags[0] : "General", // Use first tag as category
		questions: quiz.questions.length,
		playersJoined: quiz._count.quizSessions, // Number of sessions as players joined
		createdAt: quiz.createdAt.toISOString(),
		creator: quiz.creator.name,
		difficulty: "Medium", // Default difficulty, could be enhanced later
		thumbnail: quiz.image || "",
		tags: quiz.tags,
	}));

	const payload = {
		status: "success",
		data: transformedQuizzes,
		meta: {
			total,
			limit: take,
			offset: skip,
		},
	};

	res.status(200).json(payload);
});

export { getPublicQuizzes };
