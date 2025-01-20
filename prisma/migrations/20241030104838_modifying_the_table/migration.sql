/*
  Warnings:

  - You are about to drop the column `itemsCode` on the `consignee` table. All the data in the column will be lost.
  - Added the required column `siteCode` to the `deliverySite` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "consignee" DROP COLUMN "itemsCode";

-- AlterTable
ALTER TABLE "deliverySite" ADD COLUMN     "siteCode" TEXT NOT NULL;
