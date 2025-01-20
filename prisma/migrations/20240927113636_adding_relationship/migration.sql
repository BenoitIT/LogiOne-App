/*
  Warnings:

  - You are about to drop the column `consignee` on the `stuffingreportItems` table. All the data in the column will be lost.
  - You are about to drop the column `shipper` on the `stuffingreportItems` table. All the data in the column will be lost.
  - Added the required column `consigneeId` to the `stuffingreportItems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shipperId` to the `stuffingreportItems` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "stuffingreportItems" DROP COLUMN "consignee",
DROP COLUMN "shipper",
ADD COLUMN     "consigneeId" INTEGER NOT NULL,
ADD COLUMN     "shipperId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "stuffingreportItems" ADD CONSTRAINT "stuffingreportItems_shipperId_fkey" FOREIGN KEY ("shipperId") REFERENCES "shipper"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stuffingreportItems" ADD CONSTRAINT "stuffingreportItems_consigneeId_fkey" FOREIGN KEY ("consigneeId") REFERENCES "consignee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
