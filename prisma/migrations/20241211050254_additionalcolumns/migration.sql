/*
  Warnings:

  - You are about to drop the column `locationid` on the `consignee` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "consignee" DROP CONSTRAINT "consignee_locationid_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "workCountry" TEXT NOT NULL DEFAULT 'Rwanda';

-- AlterTable
ALTER TABLE "consignee" DROP COLUMN "locationid",
ADD COLUMN     "location" TEXT NOT NULL DEFAULT 'Rwanda,Kigali',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "shippingInstruction" ADD COLUMN     "editedBy" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "preparedBy" TEXT NOT NULL DEFAULT '';
