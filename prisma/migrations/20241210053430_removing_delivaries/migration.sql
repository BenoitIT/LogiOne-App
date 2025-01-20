/*
  Warnings:

  - You are about to drop the column `deliveryId` on the `stuffingreport` table. All the data in the column will be lost.
  - Added the required column `finaldeliverId` to the `stuffingreport` table without a default value. This is not possible if the table is not empty.
  - Made the column `deliverySiteId` on table `stuffingreport` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "shippingInstruction" DROP CONSTRAINT "shippingInstruction_finaldeliverId_fkey";

-- DropForeignKey
ALTER TABLE "stuffingreport" DROP CONSTRAINT "stuffingreport_deliveryId_fkey";

-- DropForeignKey
ALTER TABLE "stuffingreport" DROP CONSTRAINT "stuffingreport_deliverySiteId_fkey";

-- AlterTable
ALTER TABLE "stuffingreport" DROP COLUMN "deliveryId",
ADD COLUMN     "finaldeliverId" INTEGER NOT NULL,
ALTER COLUMN "deliverySiteId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "stuffingreport" ADD CONSTRAINT "stuffingreport_deliverySiteId_fkey" FOREIGN KEY ("deliverySiteId") REFERENCES "deliverySite"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
