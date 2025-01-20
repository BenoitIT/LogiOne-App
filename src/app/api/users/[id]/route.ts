import prisma from "../../../../../prisma/client";
import { NextResponse } from "next/server";

export const DELETE = async (req: Request) => {
  try {
    const userId = req.url.split("users/")[1];
    const userToDelete = await prisma.user.delete({
      where: {
        id: Number(userId),
      },
    });
    if (userToDelete) {
      return NextResponse.json({
        status: 200,
        message: "User is deleted successfully",
      });
    }
    return NextResponse.json({
      status: 404,
      message: "User is not found",
    });
  } catch (err) {
    return NextResponse.json({
      status: 400,
      message: "Could not delet this staff.",
    });
  }
};
export const GET = async (req: Request) => {
  try {
    const userId = req.url.split("users/")[1];
    const user = await prisma.user.findFirst({
      where: {
        id: Number(userId),
      },
    });
    if (user) {
      return NextResponse.json({
        status: 200,
        data: user
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
    const userId = req.url.split("users/")[1];
    const body = await req.json();
    const user = await prisma.user.update({
      where: {
        id: Number(userId),
      },
      data: body
    });
    if (user) {
      return NextResponse.json({
        status: 200,
        message: "Staff information are updated succesfully",
      });
    }
    return NextResponse.json({
      status: 404,
      message: "Coud not find this staff",
    });
  } catch (err) {
    return NextResponse.json({
      status: 400,
      message: "something went wrong",
    });
  }
};