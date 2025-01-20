-- CreateTable
CREATE TABLE "Commissions" (
    "id" SERIAL NOT NULL,
    "agentId" INTEGER NOT NULL,
    "handling" DOUBLE PRECISION NOT NULL,
    "rate" INTEGER NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "amountPaid" INTEGER NOT NULL DEFAULT 0,
    "paymentStatus" TEXT NOT NULL DEFAULT 'unpaid',
    "paidAt" TEXT NOT NULL DEFAULT '',
    "paidBy" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Commissions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Commissions" ADD CONSTRAINT "Commissions_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
