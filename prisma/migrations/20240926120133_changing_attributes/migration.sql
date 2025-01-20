/*
  Warnings:

  - Changed the type of `destination` on the `stuffingreport` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "stuffingreport" DROP COLUMN "destination",
ADD COLUMN     "destination" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "stuffingreport" ADD CONSTRAINT "stuffingreport_destination_fkey" FOREIGN KEY ("destination") REFERENCES "deliverySite"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
