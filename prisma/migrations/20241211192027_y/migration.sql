/*
  Warnings:

  - You are about to drop the column `editedBy` on the `shippingInstruction` table. All the data in the column will be lost.
  - You are about to drop the column `preparedBy` on the `shippingInstruction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "shippingInstruction" DROP COLUMN "editedBy",
DROP COLUMN "preparedBy";

-- AlterTable
ALTER TABLE "stuffingreportItems" ADD COLUMN     "editedBy" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "preparedBy" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "updatedAt" TEXT NOT NULL DEFAULT '';
