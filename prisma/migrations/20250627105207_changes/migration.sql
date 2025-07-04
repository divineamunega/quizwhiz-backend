/*
  Warnings:

  - You are about to drop the column `answer` on the `Answer` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Question` table. All the data in the column will be lost.
  - Added the required column `text` to the `Answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Answer" DROP COLUMN "answer",
ADD COLUMN     "text" TEXT NOT NULL,
ALTER COLUMN "position" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "title",
ADD COLUMN     "text" TEXT NOT NULL,
ALTER COLUMN "position" DROP NOT NULL;
