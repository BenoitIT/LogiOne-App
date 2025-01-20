import prisma from "../../../../../prisma/client";
import { NextResponse } from "next/server";

export const DELETE = async (req: Request) => {
  try {
    const shipperId = req.url.split("shippers/")[1];
    const shipperToDelete = await prisma.shipper.delete({
      where: {
        id: Number(shipperId),
      },
    });
    if (shipperToDelete) {
      return NextResponse.json({
        status: 200,
        message: "Shipper is deleted successfully",
      });
    }
    return NextResponse.json({
      status: 404,
      message: "Shipper is not found",
    });
  } catch (err) {
    return NextResponse.json({
      status: 400,
      message: "something went wrong",
    });
  }
};
export const GET = async (req: Request) => {
  try {
    const shipperId = req.url.split("shippers/")[1];
    const shipper = await prisma.shipper.findFirst({
      where: {
        id: Number(shipperId),
      },
    });
    if (shipper) {
      return NextResponse.json({
        status: 200,
        data: shipper,
      });
    }
    return NextResponse.json({
      status: 404,
      data: null,
    });
  } catch (err) {
    return NextResponse.json({
      status: 400,
      message: "something went wrong",
    });
  }
};

export const PUT = async (req: Request) => {
  try {
    const shipperId = req.url.split("shippers/")[1];
    const body = await req.json();
    const shipper = await prisma.shipper.update({
      where: {
        id: Number(shipperId),
      },
      data: body
    });
    if (shipper) {
      return NextResponse.json({
        status: 200,
        message: "Shipper's information are updated succesfully",
      });
    }
    return NextResponse.json({
      status: 404,
      message: "Coud not find shipper",
    });
  } catch (err) {
    return NextResponse.json({
      status: 400,
      message: "something went wrong",
    });
  }
};