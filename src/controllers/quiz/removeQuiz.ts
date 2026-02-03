import { AuthenticatedRequest } from "@/types";
import { AppError } from "@/errors";
import { prisma } from "@/lib";
import { AsyncErrorHandler } from "@/middlewares";

export const removeQuiz = AsyncErrorHandler(async function (
  req: AuthenticatedRequest,
  res,
) {
  const quizId = req.params.id;
  const userId = req.user?.id;

  if (!quizId) {
    throw new AppError("Quiz ID is required", 400);
  }

  const result = await prisma.quiz.updateMany({
    where: {
      id: quizId,
      creatorId: userId,
      isDeleted: false,
    },
    data: {
      isDeleted: true,
    },
  });

  if (result.count === 0) {
    throw new AppError("Quiz not found", 404);
  }

  res.status(204).send();
});
