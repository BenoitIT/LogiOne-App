-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_detailsId_fkey";

-- DropForeignKey
ALTER TABLE "shippingInstruction" DROP CONSTRAINT "shippingInstruction_itemId_fkey";

-- DropForeignKey
ALTER TABLE "stuffingreportItems" DROP CONSTRAINT "stuffingreportItems_stuffingreportid_fkey";

-- AddForeignKey
ALTER TABLE "shippingInstruction" ADD CONSTRAINT "shippingInstruction_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "stuffingreportItems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stuffingreportItems" ADD CONSTRAINT "stuffingreportItems_stuffingreportid_fkey" FOREIGN KEY ("stuffingreportid") REFERENCES "stuffingreport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_detailsId_fkey" FOREIGN KEY ("detailsId") REFERENCES "stuffingreportItems"("invoiceNo") ON DELETE CASCADE ON UPDATE CASCADE;
