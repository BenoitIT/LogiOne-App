/*
  Warnings:

  - You are about to drop the column `salesAgent` on the `stuffingreportItems` table. All the data in the column will be lost.
  - Added the required column `tinnumber` to the `consignee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shipperId` to the `stuffingreport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salesAgentId` to the `stuffingreportItems` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "stuffingreportItems" DROP CONSTRAINT "stuffingreportItems_shipperId_fkey";

-- AlterTable
ALTER TABLE "consignee" ADD COLUMN     "tinnumber" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "shipper" ALTER COLUMN "name" SET DEFAULT 'loginOne Company Ltd',
ALTER COLUMN "location" SET DEFAULT 'Kigali-Rwanda',
ALTER COLUMN "email" SET DEFAULT 'info@superfreightservice.com',
ALTER COLUMN "phone" SET DEFAULT '+250788713189';

-- AlterTable
ALTER TABLE "stuffingreport" ADD COLUMN     "shipperId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "stuffingreportItems" DROP COLUMN "salesAgent",
ADD COLUMN     "salesAgentId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "CalculationDependancy" (
    "id" SERIAL NOT NULL,
    "usd" INTEGER NOT NULL DEFAULT 1,
    "aed" DOUBLE PRECISION NOT NULL DEFAULT 3.66,
    "freightRate" DOUBLE PRECISION NOT NULL DEFAULT 100,

    CONSTRAINT "CalculationDependancy_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "stuffingreport" ADD CONSTRAINT "stuffingreport_shipperId_fkey" FOREIGN KEY ("shipperId") REFERENCES "shipper"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stuffingreportItems" ADD CONSTRAINT "stuffingreportItems_salesAgentId_fkey" FOREIGN KEY ("salesAgentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
