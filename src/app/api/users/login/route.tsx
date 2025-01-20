import prisma from "../../../../../prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const user = await prisma.user.findFirst({
    where: {
      email: body.email,
    },
  });
  if (user) {
    const passwordMatch = await bcrypt.compare(body.password, user.password);
    if (!passwordMatch)
      return NextResponse.json({
        status: 400,
        message: "Incorrect password provided!",
      });
    const accessToken = jwt.sign(
      {
        userId: user.id,
        role: user.role,
        email: user.email,
      },
      process.env.NEXT_JWT_SECRETE!
    );
    return NextResponse.json({
      status: 200,
      message: "Welcome back!",
      data: user,
      token: accessToken,
    });
  }
  return NextResponse.json({
    status: 400,
    message: "Email does not exist.",
  });
};
