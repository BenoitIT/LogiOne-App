-- AlterTable
ALTER TABLE "CalculationDependancy" ADD COLUMN     "fullTransportFee" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "groupageTransportFee" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "stuffingreport" ADD COLUMN     "extraCharges" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "transportFee" INTEGER NOT NULL DEFAULT 0;
