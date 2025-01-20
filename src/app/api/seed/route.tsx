import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";

export const POST = async () => {
  const shipperSeed = {
    name: "loginOne Company Ltd",
    location: "Kigali-Rwanda",
    email: "info@superfreightservice.com",
    phone: "+250788713189",
  };
  const shippingdepandancyseed = {
    usd: 1,
    aed: 3.66,
    freightRate: 260,
    freightRateFullCont: 270,
  };
  const saveShipper = await prisma.shipper.create({ data: shipperSeed });
  const shippingdepandance = await prisma.calculationDependancy.create({
    data: shippingdepandancyseed,
  });
  return NextResponse.json({
    status: 201,
    data: saveShipper,
    shippingdepandance,
  });
};
