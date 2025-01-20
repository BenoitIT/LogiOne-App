import prisma from "../../../../prisma/client";
import { NextRequest, NextResponse } from "next/server";
import deliveryValidationSchema from "../validations/deliverySite";
export const revalidate = 0;
export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const validation = deliveryValidationSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json({
      message:
        validation.error.errors[0].path +
        " " +
        validation.error.errors[0].message,
      status: 400,
    });
  }
  const deliverySite = await prisma.deliverySite.create({
    data: body,
  });
  return NextResponse.json({
    message: "New destination site is registred",
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
  const itemCount = await prisma.deliverySite.count({
    where: searchValue
      ? {
          OR: [
            { country: { contains: searchValue, mode: "insensitive" } },
            { locationName: { contains: searchValue, mode: "insensitive" } },
            {
              user: {
                OR: [
                  { firstName: { contains: searchValue, mode: "insensitive" } },
                  { lastName: { contains: searchValue, mode: "insensitive" } },
                ],
              },
            },
          ],
        }
      : {},
  });
  const deliverySites = await prisma.deliverySite.findMany({
    where: searchValue
      ? {
          OR: [
            { country: { contains: searchValue, mode: "insensitive" } },
            { locationName: { contains: searchValue, mode: "insensitive" } },
            {
              user: {
                OR: [
                  { firstName: { contains: searchValue, mode: "insensitive" } },
                  { lastName: { contains: searchValue, mode: "insensitive" } },
                ],
              },
            },
          ],
        }
      : {},
    include: {
      user: true,
    },
    take: pageSize,
    skip: offset,
  });
  const totalPages = Math.ceil(itemCount / pageSize);
  const transformedSites = deliverySites.map((site) => ({
    id: site.id,
    country: site.country,
    locationName: site.locationName,
    siteCode: site.siteCode,
    agent: `${site.user.firstName} ${site.user.lastName}`,
  }));
  return NextResponse.json({
    data: { sites: transformedSites, count: totalPages },
    status: 200,
  });
};
