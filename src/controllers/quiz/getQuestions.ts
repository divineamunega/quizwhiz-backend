import { AppError } from "@/errors";
import { AsyncErrorHandler } from "@/middlewares";
import { prisma } from "@/lib";

// todo pagainate this
export const getQuestions = AsyncErrorHandler(async function (req, res, next) {
	const quizId = req.params.id;

	// atp i think this is redundant
	if (!quizId) throw new AppError("Quiz not found ", 404);

	const quiz = await prisma.quiz.findUnique({
		where: {
			id: quizId,
			isDeleted: false,
			// todo change this to accomodate private quizzes
			visibility: "PUBLIC",
		},
	});

	if (!quiz) {
		return next(new AppError("Quiz not found", 404));
	}

	const data = await prisma.question.findMany({
		where: { quizId: quizId },
		include: { answers: { select: { isCorrect: true, id: true, text: true } } },
	});

	res.status(200).json({ status: "success", data });
});
