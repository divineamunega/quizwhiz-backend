/*
  Warnings:

  - Added the required column `type` to the `VerificationCode` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VerificationType" AS ENUM ('EMAIL', 'PASSWORD_RESET');

-- AlterTable
ALTER TABLE "VerificationCode" ADD COLUMN     "type" "VerificationType" NOT NULL;
