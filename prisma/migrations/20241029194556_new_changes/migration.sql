/*
  Warnings:

  - Added the required column `blCode` to the `stuffingreport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `destinationId` to the `stuffingreport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `packagingType` to the `stuffingreport` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "stuffingreport" ADD COLUMN     "blCode" TEXT NOT NULL,
ADD COLUMN     "destinationId" INTEGER NOT NULL,
ADD COLUMN     "packagingType" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "stuffingreport" ADD CONSTRAINT "stuffingreport_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "deliverySite"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
