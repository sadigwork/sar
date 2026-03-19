-- CreateEnum
CREATE TYPE "ReviewStage" AS ENUM ('REGISTRAR_REVIEW', 'REVIEWER_REVIEW', 'FINANCE_REVIEW', 'ADMIN_REVIEW');

-- AlterEnum
ALTER TYPE "ProfileStatus" ADD VALUE 'FINANCE_REVIEW';

-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "currentStage" "ReviewStage" DEFAULT 'REGISTRAR_REVIEW',
ADD COLUMN     "submittedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "ApplicationReview" ADD COLUMN     "isOverride" BOOLEAN DEFAULT false,
ADD COLUMN     "overrideReason" TEXT,
ADD COLUMN     "stage" "ReviewStage" NOT NULL DEFAULT 'REGISTRAR_REVIEW';

-- CreateTable
CREATE TABLE "DocumentReview" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "decision" "ReviewDecision" NOT NULL,
    "comment" TEXT,
    "stage" "ReviewStage" NOT NULL DEFAULT 'REGISTRAR_REVIEW',

    CONSTRAINT "DocumentReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileReview" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "decision" "ReviewDecision" NOT NULL,
    "comment" TEXT,
    "stage" "ReviewStage" NOT NULL DEFAULT 'REGISTRAR_REVIEW',

    CONSTRAINT "ProfileReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ApplicationReview_applicationId_stage_idx" ON "ApplicationReview"("applicationId", "stage");

-- AddForeignKey
ALTER TABLE "DocumentReview" ADD CONSTRAINT "DocumentReview_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentReview" ADD CONSTRAINT "DocumentReview_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileReview" ADD CONSTRAINT "ProfileReview_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileReview" ADD CONSTRAINT "ProfileReview_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
