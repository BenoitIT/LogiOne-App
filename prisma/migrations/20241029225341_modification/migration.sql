/*
  Warnings:

  - You are about to drop the column `others` on the `stuffingreportItems` table. All the data in the column will be lost.
  - Added the required column `carHanging` to the `stuffingreportItems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `carLashing` to the `stuffingreportItems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inspection` to the `stuffingreportItems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `insurance` to the `stuffingreportItems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recovery` to the `stuffingreportItems` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "stuffingreportItems" DROP COLUMN "others",
ADD COLUMN     "carHanging" INTEGER NOT NULL,
ADD COLUMN     "carLashing" INTEGER NOT NULL,
ADD COLUMN     "inspection" INTEGER NOT NULL,
ADD COLUMN     "insurance" INTEGER NOT NULL,
ADD COLUMN     "recovery" INTEGER NOT NULL;
