import prisma from "../../../../../prisma/client";
import { NextResponse } from "next/server";
export const revalidate = 0;
export const GET = async () => {
  const users = await prisma.user.findMany({
    where: {
      OR: [{ role: "operation manager" }, { role: "admin" }],
    },
    include: {
      deliverySite: true,
    },
  });
  return NextResponse.json({
    status: 200,
    data: users,
  });
};
export const POST = async (req: Request) => {
  const body = await req.json();
  const checkUserPhoneExistance = await prisma.user.findFirst({
    where: {
      phone: body.phone,
    },
  });
  body.email = body.firstName + body.firstName[0] + ".agent" + "@" + "fake.com";
  body.password = body.firstName + body.firstName[0];
  body.lastName = body.lastName ?? "-";
  body.workCountry = "-";
  if (!checkUserPhoneExistance) {
    const user = await prisma.user.create({
      data: body,
    });
    return NextResponse.json({
      status: 201,
      message: "A sales agent is registred",
      data: user,
    });
  } else {
    return NextResponse.json({
      status: 400,
      message: "A sales agent is already registred",
    });
  }
};
