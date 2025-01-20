-- AlterTable
ALTER TABLE "CalculationDependancy" ADD COLUMN     "freightRateFullCont" DOUBLE PRECISION NOT NULL DEFAULT 270,
ALTER COLUMN "freightRate" SET DEFAULT 260;
