import { AuthenticatedRequest } from "@/types";
import { NextFunction, Response } from "express";
import { AsyncErrorHandler } from "@/middlewares";
import { prisma } from "@/lib";
import { AppError } from "@/errors";

export const addQuestion = AsyncErrorHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { text: questionText, answers } = req.data;
    const quizId = req.params.id;
    console.log(quizId, "quizId");

    const user = req.user!;

    const quiz = await prisma.quiz.findUnique({
      where: {
        id: quizId,
        isDeleted: false,
      },
    });

    if (!quiz) {
      return next(new AppError("Quiz not found", 404));
    }

    if (quiz.creatorId !== user.id) {
      return next(
        new AppError(
          "You are not authorized to add questions to this quiz",
          403,
        ),
      );
    }

    const newQuestion = await prisma.question.create({
      data: {
        quizId,
        text: questionText,
        answers: {
          create: answers,
        },
      },
      include: {
        answers: true,
      },
    });

    res.status(201).json({
      status: "success",
      data: newQuestion,
    });
  },
);
