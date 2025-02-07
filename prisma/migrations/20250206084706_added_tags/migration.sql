/*
  Warnings:

  - Added the required column `visibility` to the `Quiz` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "QuizVisibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "visibility" "QuizVisibility" NOT NULL;
