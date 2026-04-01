/*
  Warnings:

  - You are about to drop the column `year` on the `Education` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Education" DROP COLUMN "year",
ADD COLUMN     "endYear" INTEGER,
ADD COLUMN     "inProgress" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "startYear" INTEGER;

-- CreateTable
CREATE TABLE "Certification" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "descriptionAr" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "appliedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Certification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Certification" ADD CONSTRAINT "Certification_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
