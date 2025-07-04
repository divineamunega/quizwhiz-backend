/*
  Warnings:

  - You are about to drop the column `question` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `joinCode` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the column `numberOfQuestions` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the column `isEmailVerified` on the `RefreshToken` table. All the data in the column will be lost.
  - You are about to drop the column `isGoogleVerified` on the `RefreshToken` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[questionId,order]` on the table `Answer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[quizId,order]` on the table `Question` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `title` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Quiz` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "QuizSessionType" AS ENUM ('LIVE', 'SOLO');

-- AlterTable
ALTER TABLE "Answer" ADD COLUMN     "order" INTEGER;

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "question",
ADD COLUMN     "order" INTEGER,
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Quiz" DROP COLUMN "joinCode",
DROP COLUMN "name",
DROP COLUMN "numberOfQuestions",
DROP COLUMN "status",
ADD COLUMN     "image" TEXT,
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "RefreshToken" DROP COLUMN "isEmailVerified",
DROP COLUMN "isGoogleVerified",
ADD COLUMN     "image" TEXT;

-- DropEnum
DROP TYPE "QuizStatus";

-- CreateTable
CREATE TABLE "QuizSession" (
    "id" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "hostId" TEXT NOT NULL,
    "joinCode" TEXT,
    "type" "QuizSessionType" NOT NULL DEFAULT 'SOLO',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "QuizSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizParticipant" (
    "id" TEXT NOT NULL,
    "quizSessionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "score" INTEGER DEFAULT 0,

    CONSTRAINT "QuizParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QuizSession_joinCode_key" ON "QuizSession"("joinCode");

-- CreateIndex
CREATE UNIQUE INDEX "QuizParticipant_quizSessionId_userId_key" ON "QuizParticipant"("quizSessionId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Answer_questionId_order_key" ON "Answer"("questionId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "Question_quizId_order_key" ON "Question"("quizId", "order");

-- AddForeignKey
ALTER TABLE "QuizSession" ADD CONSTRAINT "QuizSession_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizParticipant" ADD CONSTRAINT "QuizParticipant_quizSessionId_fkey" FOREIGN KEY ("quizSessionId") REFERENCES "QuizSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizParticipant" ADD CONSTRAINT "QuizParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
