import prisma from "../../../../prisma/client";
import { NextRequest, NextResponse } from "next/server";
import shipperValidationSchema from "../validations/shipper";
export const revalidate = 0;
export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const shipperValidation = shipperValidationSchema.safeParse(body);
  if (!shipperValidation.success)
    return NextResponse.json({
      message:
        shipperValidation.error.errors[0].path +
        " " +
        shipperValidation.error.errors[0].message,
      status: 400,
    });
  if (body.email != "" || body.name != "") {
    const checkShipperEmailExistance = await prisma.shipper.findFirst({
      where: { OR: [{ email: body.email }, { name: body.name }] },
    });
    if (checkShipperEmailExistance)
      return NextResponse.json({
        status: 400,
        message: "That shipper already exist. change either name or email",
      });
  }
  const checkshipperPhoneExistance = await prisma.shipper.findFirst({
    where: {
      phone: body.phone,
    },
  });
  if (checkshipperPhoneExistance)
    return NextResponse.json({
      status: 400,
      message: "A shipper with this phone number already exist.",
    });

  const shipper = await prisma.shipper.create({ data: body });
  return NextResponse.json({
    status: 201,
    message: "New shipper is successfully registred!",
    data: shipper,
  });
};

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const searchValue = searchParams.get("search");
  const shippers = await prisma.shipper.findMany({
    where: searchValue
      ? {
          OR: [
            { name: { contains: searchValue, mode: "insensitive" } },
            { location: { contains: searchValue, mode: "insensitive" } },
            { phone: { contains: searchValue, mode: "insensitive" } },
            { email: { contains: searchValue, mode: "insensitive" } },
          ],
        }
      : {},
  });
  return NextResponse.json({
    status: 200,
    data: shippers,
  });
};
