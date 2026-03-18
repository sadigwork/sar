/*
  Warnings:

  - Added the required column `months` to the `Experience` table without a default value. This is not possible if the table is not empty.
  - Added the required column `years` to the `Experience` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Experience" ADD COLUMN     "months" INTEGER NOT NULL,
ADD COLUMN     "years" INTEGER NOT NULL;
