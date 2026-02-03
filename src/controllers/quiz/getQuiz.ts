import { NextFunction, Request, Response } from "express";
import { AsyncErrorHandler } from "@/middlewares";
import { AppError } from "@/errors";
import { prisma } from "@/lib";

// TODO find a way to get private quizzes to verified users
// Todo Option 1 custom protect middleware for getQuiz that doesnt just immediately thow an Error
export const getQuiz = AsyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    if (!id) throw new AppError("Invalid request. Quiz ID is missing.", 400);

    const quiz = await prisma.quiz.findFirst({
      where: { id, visibility: "PUBLIC", isDeleted: false },
      select: {
        id: true,
        title: true,
        image: true,
        description: true,
        createdAt: true,
        tags: true,
        visibility: true,
        creatorId: true,
      },
    });

    if (!quiz) throw new AppError("Quiz with that ID not found", 404);

    res.status(200).json({
      status: "success",
      data: {
        id: quiz.id,
        title: quiz.title,
        image: quiz.image ? quiz.image : null,
        description: quiz.description,
        createdAt: quiz.createdAt,
        tags: quiz.tags.length > 0 ? quiz.tags : null,
        visibility: quiz.visibility,
      },
    });
  },
);
