import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";
export const revalidate = 0;
export const GET = async () => {
  const deliveries = await prisma.deliveries.findMany({});
  return NextResponse.json({
    status: 200,
    data: deliveries,
  });
};
