/*
  Warnings:

  - Added the required column `invoiceNo` to the `stuffingreportItems` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "stuffingreportItems" ADD COLUMN     "invoiceNo" TEXT NOT NULL;
