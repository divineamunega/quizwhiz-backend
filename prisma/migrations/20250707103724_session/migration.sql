/*
  Warnings:

  - Made the column `joinCode` on table `QuizSession` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "QuizSession" ADD COLUMN     "allowNavigation" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "joinCode" SET NOT NULL;
