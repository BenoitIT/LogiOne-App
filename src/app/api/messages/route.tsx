import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";
export const revalidate = 0;
export const GET = async () => {
  const messages = await prisma.message.findMany({
    orderBy: {
      id: "desc",
    },
  });
  return NextResponse.json({
    status: 200,
    data: messages,
  });
};

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const message = await prisma.message.create({
      data: {
        firstName: body.firstName||"",
        lastName: body.lastName||"",
        email: body.email || "",
        phone: body.phone,
        message: body.message,
      },
    });
    if (message) {
      return NextResponse.json({
        status: 201,
        message: "Your message is sent. Expect to hear from us.",
      });
    } else {
      return NextResponse.json({
        status: 400,
        message: "Failed to send the message",
      });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      status: 400,
      message: "Failed to send the message",
    });
  }
};
