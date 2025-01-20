-- CreateTable
CREATE TABLE "deliverySite" (
    "id" SERIAL NOT NULL,
    "country" TEXT NOT NULL,
    "locationName" TEXT NOT NULL,
    "agent" INTEGER NOT NULL,

    CONSTRAINT "deliverySite_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "deliverySite" ADD CONSTRAINT "deliverySite_agent_fkey" FOREIGN KEY ("agent") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
