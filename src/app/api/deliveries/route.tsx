import prisma from "../../../../prisma/client";
import { NextRequest, NextResponse } from "next/server";
import deliveriesValidationSchema from "../validations/deliveries";
export const revalidate = 0;
export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const validation = deliveriesValidationSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json({
      message:
        validation.error.errors[0].path +
        " " +
        validation.error.errors[0].message,
      status: 400,
    });
  }
  const deliverySite = await prisma.deliveries.create({
    data: body,
  });
  return NextResponse.json({
    message: "New delivery is registred",
    data: deliverySite,
    status: 201,
  });
};

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const searchValue = searchParams.get("search");
  const currentPage = Number(searchParams?.get("page")) || 1;
  const pageSize = 13;
  const offset = (currentPage - 1) * pageSize;
  const itemCount = await prisma.deliveries.count({
    where: searchValue
      ? {
          OR: [
            { country: { contains: searchValue, mode: "insensitive" } },
            { deliveryName: { contains: searchValue, mode: "insensitive" } },
          ],
        }
      : {},
  });
  const deliverySites = await prisma.deliveries.findMany({
    where: searchValue
      ? {
          OR: [
            { country: { contains: searchValue, mode: "insensitive" } },
            { deliveryName: { contains: searchValue, mode: "insensitive" } },
          ],
        }
      : {},
      orderBy:{
        id:"desc"
      },
    take: pageSize,
    skip: offset,
  });
  const totalPages = Math.ceil(itemCount / pageSize);
  return NextResponse.json({
    data: { sites: deliverySites, count: totalPages },
    status: 200,
  });
};
