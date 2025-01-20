/*
  Warnings:

  - You are about to drop the column `totalAmountInWords` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `totalamountinword` on the `shippingInstruction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "totalAmountInWords";

-- AlterTable
ALTER TABLE "shippingInstruction" DROP COLUMN "totalamountinword";

-- AlterTable
ALTER TABLE "stuffingreportItems" ADD COLUMN     "portOfdischarge" TEXT NOT NULL DEFAULT ' ',
ADD COLUMN     "totalinwords" TEXT NOT NULL DEFAULT 'Amount in dollars';
