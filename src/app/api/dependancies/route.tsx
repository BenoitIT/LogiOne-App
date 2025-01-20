import prisma from "../../../../prisma/client";
import { NextRequest, NextResponse } from "next/server";
export const revalidate = 0;

export const GET = async () => {
  try {
    const calculationDependancies =
      await prisma.calculationDependancy.findFirst({});
    if (calculationDependancies) {
      return NextResponse.json({
        status: 200,
        data: calculationDependancies,
      });
    } else {
      return NextResponse.json({
        status: 400,
        data: null,
      });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      status: 400,
      data: null,
    });
  }
};
export const PUT = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const calculationDependancies =
      await prisma.calculationDependancy.findFirst({});
    if (calculationDependancies) {
      const updatedInfo = await prisma.calculationDependancy.update({
        where: {
          id: calculationDependancies.id,
        },
        data: body,
      });
      return NextResponse.json({
        status: 200,
        data: updatedInfo,
        message: "Update success",
      });
    } else {
      return NextResponse.json({
        status: 400,
        message: "Update failed",
      });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      status: 400,
      message: "Update failed",
    });
  }
};
