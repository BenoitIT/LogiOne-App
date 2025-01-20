import prisma from "../../../../../prisma/client";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { resetPasswordEmailTemplate } from "@/appComponents/emailTemplates/passwordReset";
export const revalidate = 0;
const resend = new Resend(process.env.NEXT_RESEND_API_KEY!);
const frontendLink = process.env.NEXT_FRONTEND_URL!;
export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const user = await prisma.user.findFirst({
    where: {
      email: body.email,
    },
  });
  if (!user)
    return NextResponse.json({
      status: 400,
      message: "Email has not been registred",
    });
  const resetPasswordToken = jwt.sign(
    { id: user.id },
    process.env.NEXT_JWT_SECRETE!,
    { expiresIn: "300s" }
  );
  const { data, error } = await resend.emails.send({
    from: "loginOneltd@loginOneltd.com",
    to: user.email,
    subject: "Password reset link",
    react: resetPasswordEmailTemplate({
      appUrl: frontendLink,
      token: resetPasswordToken,
    }),
    html: ``,
  });
  if (error) console.error(error);
  return NextResponse.json({
    status: 200,
    message: "Password reseting link was sent to the email. check your email",
    data: data,
  });
};
