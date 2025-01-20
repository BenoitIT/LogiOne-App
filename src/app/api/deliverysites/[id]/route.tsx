import prisma from "../../../../../prisma/client";
import { NextResponse } from "next/server";

export const DELETE = async (req: Request) => {
  try {
    const siteId = req.url.split("deliverysites/")[1];
    const site = await prisma.deliverySite.delete({
      where: {
        id: Number(siteId),
      },
    });
    if (site) {
      return NextResponse.json({
        status: 200,
        message: "Delivery site is deleted successfully",
      });
    }
    return NextResponse.json({
      status: 404,
      message: "Delivery site is not found",
    });
  } catch (err) {
    return NextResponse.json({
      status: 400,
      message: "Deletion failed. some data related to this location may loose",
    });
  }
};
export const GET = async (req: Request) => {
  try {
    const siteId = req.url.split("deliverysites/")[1];
    const site = await prisma.deliverySite.findFirst({
      where: {
        id: Number(siteId),
      },
    });
    if (site) {
      return NextResponse.json({
        status: 200,
        data: site,
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
    const siteId = req.url.split("deliverysites/")[1];
    const body = await req.json();
    const site = await prisma.deliverySite.update({
      where: {
        id: Number(siteId),
      },
      data: body,
    });
    if (site) {
      return NextResponse.json({
        status: 200,
        message: "Delivery site information are updated succesfully",
      });
    }
    return NextResponse.json({
      status: 404,
      message: "Coud not find delievery site",
    });
  } catch (err) {
    return NextResponse.json({
      status: 400,
      message: "something went wrong",
    });
  }
};
