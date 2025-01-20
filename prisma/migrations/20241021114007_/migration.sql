/*
  Warnings:

  - You are about to drop the column `destination` on the `stuffingreport` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "stuffingreport" DROP CONSTRAINT "stuffingreport_destination_fkey";

-- AlterTable
ALTER TABLE "stuffingreport" DROP COLUMN "destination",
ADD COLUMN     "stuffingstatus" TEXT NOT NULL DEFAULT 'preview';
