import { AppError } from "@/errors";
import { prisma } from "@/lib";
import { AsyncErrorHandler } from "@/middlewares";
import { QuizSessionType } from "@prisma/client"; // Ensure this is exported from your schema
import { nanoid } from "nanoid";

export const createSessions = AsyncErrorHandler(async (req, res) => {
	const quizId = req.params.id;
	const user = req.user;
	const userId = user?.id;

	if (!quizId) throw new AppError("Quiz ID is required", 400);

	// Read and validate mode from query
	const modeParam = String(req.query.mode || "solo").toLowerCase();
	const mode =
		modeParam === "live"
			? QuizSessionType.LIVE
			: modeParam === "solo"
				? QuizSessionType.SOLO
				: null;

	if (!mode) {
		throw new AppError("Invalid session mode. Must be 'solo' or 'live'.", 400);
	}

	// Check if the quiz exists and is public and not deleted
	const quiz = await prisma.quiz.findFirst({
		where: { id: quizId, visibility: "PUBLIC", isDeleted: false },
		select: { id: true, title: true },
	});

	if (!quiz) {
		throw new AppError("Quiz not found or inaccessible.", 404);
	}

	// Generate unique join code
	const joinCode = nanoid(8); // e.g., "f82dj29x"

	// Create new quiz session
	const quizSession = await prisma.quizSession.create({
		data: {
			hostId: userId!,
			quizId: quizId,
			type: mode,
			joinCode,
			// hostParticipantId: null — for now, host doesn't participate in LIVE
		},
		include: { quiz: true },
	});

	res.status(201).json({
		status: "success",
		data: {
			sessionId: quizSession.id,
			mode: quizSession.type,
			title: quizSession.quiz.title,
			joinCode: quizSession.joinCode,
			createdAt: quizSession.startedAt,
			playerName: user?.name,
		},
	});
});
