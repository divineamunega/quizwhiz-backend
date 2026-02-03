import { AuthenticatedRequest } from "@/types";
import { AppError } from "@/errors";
import { prisma } from "@/lib";
import { AsyncErrorHandler } from "@/middlewares";
import { Quiz, QuizSessionType } from "@prisma/client";
// Ensure this is exported from your schema
import { Response } from "express";
import { quizQueue } from "@/lib/bullmq";

// Parse and validate session mode with clear logic
const parseSessionMode = (mode: string): QuizSessionType => {
  // Normalize input: trim whitespace and convert to lowercase
  const normalizedMode = (mode || "").trim().toLowerCase();

  // Default to SOLO if no mode specified
  if (!normalizedMode) {
    return QuizSessionType.SOLO;
  }

  // Map valid modes
  switch (normalizedMode) {
    case "live":
      return QuizSessionType.LIVE;
    case "solo":
      return QuizSessionType.SOLO;
    default:
      return QuizSessionType.SOLO;
  }
};

const soloSession = async function (
  quiz: Quiz,
  res: Response,
  req: AuthenticatedRequest,
) {
  const quizSession = await prisma.quizSession.create({
    data: {
      hostId: req.user!.id,
      quizId: quiz.id,
      type: QuizSessionType.SOLO,
      // hostParticipantId: null — for now, host doesn't participate in LIVE
    },
  });

  const data = {
    sessionId: quizSession.id,
    mode: quizSession.type,
    title: quiz.title,
    createdAt: quizSession.startedAt,
    playerName: req.user!.name,
  };

  return res.status(201).json({
    status: "success",
    data,
  });
};

const multiSession = async function () {};

export const createSessions = AsyncErrorHandler(async (req, res) => {
  const quizId = req.params.id;

  if (!quizId) throw new AppError("Quiz ID is required", 400);

  // Read and validate mode from request body
  const { mode: modeParam } = req.body;

  const mode = parseSessionMode(modeParam);

  // Check if the quiz exists and is public and not deleted
  const quiz = await prisma.quiz.findFirst({
    where: { id: quizId, visibility: "PUBLIC", isDeleted: false },
    select: { id: true, title: true },
  });

  if (!quiz) {
    throw new AppError("Quiz not found or inaccessible.", 404);
  }

  if (mode === QuizSessionType.SOLO) {
    // Put it in a queue and save to redis for fast access during playing
    await quizQueue.add("save-quiz", { quizId });

    return await soloSession(quiz as Quiz, res, req);
  }

  if (mode === QuizSessionType.LIVE) {
    return multiSession();
  }
});
