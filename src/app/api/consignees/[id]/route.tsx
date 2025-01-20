import prisma from "../../../../../prisma/client";
import { NextResponse } from "next/server";

export const DELETE = async (req: Request) => {
  try {
    const consigneeId = req.url.split("consignees/")[1];
    const consigneeToDelete = await prisma.consignee.delete({
      where: {
        id: Number(consigneeId),
      },
    });
    if (consigneeToDelete) {
      return NextResponse.json({
        status: 200,
        message: "consignee is deleted successfully",
      });
    }
    return NextResponse.json({
      status: 404,
      message: "consignee is not found",
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
    const consigneeId = req.url.split("consignees/")[1];
    const consignee = await prisma.consignee.findFirst({
      where: {
        id: Number(consigneeId),
      },
    });
    if (consignee) {
      return NextResponse.json({
        status: 200,
        data: consignee,
      });
    }
    return NextResponse.json({
      status: 404,
      message: null,
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
    const consigneeId = req.url.split("consignees/")[1];
    const body = await req.json();
    delete body.id;
    const consignee = await prisma.consignee.update({
      where: {
        id: Number(consigneeId),
      },
      data: body,
    });
    if (consignee) {
      return NextResponse.json({
        status: 200,
        message: "Consignee's information are updated succesfully",
      });
    }
    return NextResponse.json({
      status: 404,
      message: "Coud not find consignee",
    });
  } catch (err) {
    return NextResponse.json({
      status: 400,
      message: "something went wrong",
    });
  }
};
