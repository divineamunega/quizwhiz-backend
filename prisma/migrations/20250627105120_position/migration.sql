/*
  Warnings:

  - You are about to drop the column `order` on the `Answer` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `Question` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[questionId,position]` on the table `Answer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[quizId,position]` on the table `Question` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Answer_questionId_order_key";

-- DropIndex
DROP INDEX "Question_quizId_order_key";

-- AlterTable
ALTER TABLE "Answer" DROP COLUMN "order",
ADD COLUMN     "position" SERIAL;

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "order",
ADD COLUMN     "position" SERIAL;

-- CreateIndex
CREATE UNIQUE INDEX "Answer_questionId_position_key" ON "Answer"("questionId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "Question_quizId_position_key" ON "Question"("quizId", "position");
