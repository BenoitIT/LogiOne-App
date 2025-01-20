-- CreateTable
CREATE TABLE "shippingInstruction" (
    "id" SERIAL NOT NULL,
    "prepared" BOOLEAN NOT NULL DEFAULT false,
    "portOfdischarge" TEXT NOT NULL,
    "deliveryTerm" TEXT NOT NULL,
    "prepaidFreight" INTEGER NOT NULL DEFAULT 0,
    "prepaidBlFee" INTEGER NOT NULL DEFAULT 0,
    "finaldeliverId" INTEGER NOT NULL,
    "totalamountinword" TEXT NOT NULL,
    "itemId" INTEGER NOT NULL,

    CONSTRAINT "shippingInstruction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shippingInstruction_itemId_key" ON "shippingInstruction"("itemId");

-- AddForeignKey
ALTER TABLE "shippingInstruction" ADD CONSTRAINT "shippingInstruction_finaldeliverId_fkey" FOREIGN KEY ("finaldeliverId") REFERENCES "deliverySite"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shippingInstruction" ADD CONSTRAINT "shippingInstruction_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "stuffingreportItems"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
