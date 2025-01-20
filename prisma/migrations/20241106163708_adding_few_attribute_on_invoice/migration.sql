-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "paymentApproved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "releaseGenarated" BOOLEAN NOT NULL DEFAULT false;
