-- AlterTable
ALTER TABLE "RefreshToken" ADD COLUMN     "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isGoogleVerified" BOOLEAN NOT NULL DEFAULT false;
