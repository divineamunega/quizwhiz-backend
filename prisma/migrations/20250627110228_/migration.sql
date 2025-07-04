/*
  Warnings:

  - Made the column `position` on table `Answer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `position` on table `Question` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Answer" ALTER COLUMN "position" SET NOT NULL;

-- AlterTable
ALTER TABLE "Question" ALTER COLUMN "position" SET NOT NULL;
