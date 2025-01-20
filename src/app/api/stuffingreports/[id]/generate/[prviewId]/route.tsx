import { NextResponse } from "next/server";
import prisma from "../../../../../../../prisma/client";
export const revalidate=0;
export const PUT = async (req: Request) => {
  try {
    const stuffingreportId = req.url.split("generate/")[1];
    const stuffingreport = await prisma.stuffingreport.update({
      where: {
        id: Number(stuffingreportId),
      },
      data: {
        stuffingstatus: "generated",
        status: "closed",
      },
    });
    if (stuffingreport) {
      return NextResponse.json({
        status: 200,
        message: "Stuffing report is generated successfully",
      });
    }
    return NextResponse.json({
      status: 404,
      message: "Coud not find stuffing report",
    });
  } catch (err) {
    console.error(err)
    return NextResponse.json({
      status: 400,
      message: "something went wrong",
    });
  }
};
