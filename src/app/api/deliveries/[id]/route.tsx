import prisma from "../../../../../prisma/client";
import { NextResponse } from "next/server";
export const revalidate=0;
export const DELETE = async (req: Request) => {
  try {
    const deliveryId = req.url.split("deliveries/")[1];
    const delivery = await prisma.deliveries.delete({
      where: {
        id: Number(deliveryId),
      },
    });
    if (delivery) {
      return NextResponse.json({
        status: 200,
        message: "Delivery is deleted successfully",
      });
    }
    return NextResponse.json({
      status: 404,
      message: "Delivery is not found",
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
    const deliveryId = req.url.split("deliveries/")[1];
    const delivery = await prisma.deliveries.findFirst({
      where: {
        id: Number(deliveryId),
      },
    });
    if (delivery) {
      return NextResponse.json({
        status: 200,
        data: delivery,
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
    const deliveryId = req.url.split("deliveries/")[1];
    const body = await req.json();
    const delivery = await prisma.deliveries.update({
      where: {
        id: Number(deliveryId),
      },
      data: body,
    });
    if (delivery) {
      return NextResponse.json({
        status: 200,
        message: "Delivery information are updated succesfully",
      });
    }
    return NextResponse.json({
      status: 404,
      message: "Coud not find delievery delivery",
    });
  } catch (err) {
    return NextResponse.json({
      status: 400,
      message: "something went wrong",
    });
  }
};
