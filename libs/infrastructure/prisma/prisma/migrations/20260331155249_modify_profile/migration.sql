-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "graduationYear" INTEGER,
ADD COLUMN     "reviewNotes" TEXT,
ADD COLUMN     "specialization" TEXT,
ADD COLUMN     "submittedAt" TIMESTAMP(3),
ADD COLUMN     "university" TEXT;
