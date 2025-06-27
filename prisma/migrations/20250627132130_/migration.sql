-- AlterTable
ALTER TABLE "Answer" ALTER COLUMN "position" DROP NOT NULL,
ALTER COLUMN "position" DROP DEFAULT;
DROP SEQUENCE "Answer_position_seq";

-- AlterTable
ALTER TABLE "Question" ALTER COLUMN "position" DROP NOT NULL,
ALTER COLUMN "position" DROP DEFAULT;
DROP SEQUENCE "Question_position_seq";
