-- AlterTable
ALTER TABLE "CalculationDependancy" ADD COLUMN     "fullContSeaFee" INTEGER NOT NULL DEFAULT 4700,
ADD COLUMN     "groupageSeaFee" INTEGER NOT NULL DEFAULT 4700,
ALTER COLUMN "freightRateFullCont" SET DEFAULT 0,
ALTER COLUMN "groupageTransportFee" SET DEFAULT 4800;
