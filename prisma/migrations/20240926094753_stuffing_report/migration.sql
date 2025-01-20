-- CreateTable
CREATE TABLE "stuffingreport" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,

    CONSTRAINT "stuffingreport_pkey" PRIMARY KEY ("id")
);
