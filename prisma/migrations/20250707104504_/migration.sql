/*
  Warnings:

  - You are about to drop the column `allowNavigation` on the `QuizSession` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "QuizSession" DROP COLUMN "allowNavigation";

-- AddForeignKey
ALTER TABLE "QuizSession" ADD CONSTRAINT "QuizSession_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
