/*
  Warnings:

  - You are about to drop the column `location` on the `consignee` table. All the data in the column will be lost.
  - Added the required column `locationid` to the `consignee` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "consignee_email_key";

-- AlterTable
ALTER TABLE "consignee" DROP COLUMN "location",
ADD COLUMN     "locationid" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "consignee" ADD CONSTRAINT "consignee_locationid_fkey" FOREIGN KEY ("locationid") REFERENCES "deliverySite"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
