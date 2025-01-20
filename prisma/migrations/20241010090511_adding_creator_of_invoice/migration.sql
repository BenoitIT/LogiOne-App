/*
  Warnings:

  - Added the required column `staffid` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "staffid" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_staffid_fkey" FOREIGN KEY ("staffid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
