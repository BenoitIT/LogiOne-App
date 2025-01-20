import prisma from "../../../../../../prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const decoded = jwt.verify(body.token, process.env.NEXT_JWT_SECRETE!) as {
      id: number;
    };
    if (!decoded) return;
    const userId = decoded.id;
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
      },
    });
    if (!updatedUser)
      return NextResponse.json({
        status: 400,
        message: "Could not update password. token got expired",
      });
    return NextResponse.json({
      status: 200,
      message: "Password is updated successfully",
    });
  } catch (err) {
    return NextResponse.json({
      status: 400,
      message: "token got expired",
    });
  }
};

export const PUT = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const userId = body.userId;
    const oldpassword = body.oldpassword;
    const newPassword = body.newPassword;
    const newPasswordConfirmation = body.newPasswordConfirmation;
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const user = await prisma.user.findFirst({
      where: {
        id: Number(userId),
      }
    });
    if (user) {
      if (newPassword !== newPasswordConfirmation) {
        return NextResponse.json({
          status: 400,
          message: "New password and new password confrimaton should be the same"
        })
      }
      const checkOldPasswordCorrection = await bcrypt.compare(oldpassword,user.password);
      if (!checkOldPasswordCorrection) {
        return NextResponse.json({
          status: 400,
          message: "Invalid old password"
        })
      }
      const updatedUser = await prisma.user.update({
        where: {
          id: Number(userId),
        },
        data: {
          password: hashedPassword,
        },
      });
      if (!updatedUser)
        return NextResponse.json({
          status: 400,
          message: "Could not update password. token got expired",
        });
      return NextResponse.json({
        status: 200,
        message: "Password is updated successfully",
      });
    }
  } catch (err) {
    console.log(err)
    return NextResponse.json({
      status: 400,
      message: "token got expired",
    });
  }
};