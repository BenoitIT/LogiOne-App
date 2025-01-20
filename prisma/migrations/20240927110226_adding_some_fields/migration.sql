/*
  Warnings:

  - Added the required column `totalAed` to the `stuffingreportItems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalUsd` to the `stuffingreportItems` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "stuffingreportItems" ADD COLUMN     "totalAed" INTEGER NOT NULL,
ADD COLUMN     "totalUsd" INTEGER NOT NULL;
