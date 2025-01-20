-- CreateTable
CREATE TABLE "shipper" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "shipper_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consignee" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "consignee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shipper_email_key" ON "shipper"("email");

-- CreateIndex
CREATE UNIQUE INDEX "shipper_phone_key" ON "shipper"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "consignee_email_key" ON "consignee"("email");

-- CreateIndex
CREATE UNIQUE INDEX "consignee_phone_key" ON "consignee"("phone");
