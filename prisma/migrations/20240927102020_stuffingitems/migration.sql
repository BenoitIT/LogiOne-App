-- CreateTable
CREATE TABLE "stuffingreportItems" (
    "id" SERIAL NOT NULL,
    "stuffingreportid" INTEGER NOT NULL,
    "shipper" INTEGER NOT NULL,
    "consignee" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "mark" TEXT NOT NULL,
    "salesAgent" TEXT NOT NULL,
    "noOfPkgs" INTEGER NOT NULL,
    "typeOfPkg" TEXT NOT NULL,
    "weight" INTEGER NOT NULL,
    "line" INTEGER NOT NULL,
    "handling" INTEGER NOT NULL,
    "type" INTEGER NOT NULL,
    "cbm" INTEGER NOT NULL,
    "description" INTEGER NOT NULL,
    "freight" INTEGER NOT NULL,
    "blFee" INTEGER NOT NULL,
    "jb" INTEGER NOT NULL,
    "others" INTEGER NOT NULL,

    CONSTRAINT "stuffingreportItems_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "stuffingreportItems" ADD CONSTRAINT "stuffingreportItems_stuffingreportid_fkey" FOREIGN KEY ("stuffingreportid") REFERENCES "stuffingreport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
