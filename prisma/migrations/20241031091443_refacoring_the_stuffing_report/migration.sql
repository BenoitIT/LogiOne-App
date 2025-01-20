/*
  Warnings:

  - You are about to drop the column `carLashing` on the `stuffingreportItems` table. All the data in the column will be lost.
  - Added the required column `localCharges` to the `stuffingreportItems` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "stuffingreportItems" DROP COLUMN "carLashing",
ADD COLUMN     "localCharges" INTEGER NOT NULL;
