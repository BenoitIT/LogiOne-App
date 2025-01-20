import prisma from "../../../../prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import userValidationSchema from "../validations/user";
import bcrypt from "bcrypt";
import { EmailTemplate } from "@/appComponents/emailTemplates/userCreation";
export const revalidate = 0;
const resend = new Resend(process.env.NEXT_RESEND_API_KEY!);
export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const userDataValidation = userValidationSchema.safeParse(body);
  if (!userDataValidation.success)
    return NextResponse.json({
      message:
        userDataValidation.error.errors[0].path +
        " " +
        userDataValidation.error.errors[0].message,
      status: 400,
    });
  const checkUserEmailExistance = await prisma.user.findFirst({
    where: {
      email: body.email,
    },
  });
  if (checkUserEmailExistance)
    return NextResponse.json({
      status: 400,
      message: "Staff with this email already exist.",
    });
  const checkUserPhoneExistance = await prisma.user.findFirst({
    where: {
      phone: body.phone,
    },
  });
  if (checkUserPhoneExistance)
    return NextResponse.json({
      status: 400,
      message: "Staff with this phone number already exist.",
    });
  body.lastName = body.lastName ?? "-";
  const unIncryptedPassword =
    body.firstName[0] + body.lastName[0] + body.phone.slice(0, 6);
  body.password = await bcrypt.hash(unIncryptedPassword, 10);
  const user = await prisma.user.create({ data: body });
  const { data, error } = await resend.emails.send({
    from: "loginOneltd@loginOneltd.com",
    to: user.email,
    subject: "User account creation",
    react: EmailTemplate({
      firstName: user.firstName,
      email: user.email,
      password: unIncryptedPassword,
    }),
    html: ``,
  });
  if (error) console.error(error);
  return NextResponse.json({
    status: 201,
    message: "New staff is successfully registred!",
    data: user,
    email: data,
  });
};

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const searchValue = searchParams.get("search");
  const users = await prisma.user.findMany({
    where: searchValue
      ? {
          OR: [
            { firstName: { contains: searchValue, mode: "insensitive" } },
            { lastName: { contains: searchValue, mode: "insensitive" } },
            { email: { contains: searchValue, mode: "insensitive" } },
            { phone: { contains: searchValue, mode: "insensitive" } },
            { workCountry: { contains: searchValue, mode: "insensitive" } },
          ],
        }
      : {},
  });
  return NextResponse.json({
    status: 200,
    data: users,
  });
};
