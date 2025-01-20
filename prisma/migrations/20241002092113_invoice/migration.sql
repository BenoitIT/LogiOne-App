/*
  Warnings:

  - A unique constraint covering the columns `[invoiceNo]` on the table `stuffingreportItems` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "Invoice" (
    "id" SERIAL NOT NULL,
    "vat" INTEGER NOT NULL DEFAULT 0,
    "totalAmountInWords" TEXT NOT NULL,
    "detailsId" TEXT NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_detailsId_key" ON "Invoice"("detailsId");

-- CreateIndex
CREATE UNIQUE INDEX "stuffingreportItems_invoiceNo_key" ON "stuffingreportItems"("invoiceNo");

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_detailsId_fkey" FOREIGN KEY ("detailsId") REFERENCES "stuffingreportItems"("invoiceNo") ON DELETE RESTRICT ON UPDATE CASCADE;
