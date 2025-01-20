/*
  Warnings:

  - You are about to drop the column `destinationId` on the `stuffingreport` table. All the data in the column will be lost.
  - Added the required column `deliveryId` to the `stuffingreport` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "stuffingreport" DROP CONSTRAINT "stuffingreport_destinationId_fkey";

-- AlterTable
ALTER TABLE "stuffingreport" DROP COLUMN "destinationId",
ADD COLUMN     "deliveryId" INTEGER NOT NULL,
ADD COLUMN     "deliverySiteId" INTEGER;

-- CreateTable
CREATE TABLE "deliveries" (
    "id" SERIAL NOT NULL,
    "country" TEXT NOT NULL,
    "deliveryName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "deliveries_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "stuffingreport" ADD CONSTRAINT "stuffingreport_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "deliveries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stuffingreport" ADD CONSTRAINT "stuffingreport_deliverySiteId_fkey" FOREIGN KEY ("deliverySiteId") REFERENCES "deliverySite"("id") ON DELETE SET NULL ON UPDATE CASCADE;
