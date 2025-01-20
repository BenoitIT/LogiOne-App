import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";
export const revalidate = 0;

export const PUT = async (req: Request) => {
  try {
    const comminsionId = req.url.split("commissions/")[1];
    const body = await req.json();
    delete body.id;
    const date = new Date().toISOString();
    body.paidAt = date;
    const activeCommission = await prisma.commissions.findFirst({
      where: {
        id: Number(comminsionId),
      },
    });
    if (activeCommission) {
      const paidCommission = activeCommission.amountPaid + body.amountPaid;
      const paymentStatus =
        paidCommission == 0
          ? "Pending"
          : paidCommission == activeCommission.totalAmount
          ? "Paid"
          : "Partially paid";
      body.paymentStatus = paymentStatus;
      body.amountPaid = paidCommission;
      if (activeCommission.paymentStatus == "Paid") {
        return NextResponse.json({
          status: 400,
          message: "The commission is already paid",
        });
      } else if (paidCommission > activeCommission.totalAmount) {
        return NextResponse.json({
          status: 400,
          message: "Only required commission amount should be paid.",
        });
      } else {
        const comminsion = await prisma.commissions.update({
          where: {
            id: Number(comminsionId),
          },
          data: body,
        });
        if (comminsion) {
          return NextResponse.json({
            status: 200,
            message: "comminsion's information are updated succesfully",
          });
        } else {
          return NextResponse.json({
            status: 404,
            message: "Coud not find comminsion",
          });
        }
      }
    } else {
      return NextResponse.json({
        status: 404,
        message: "Commission is no longer found",
      });
    }
  } catch (err) {
    return NextResponse.json({
      status: 400,
      message: "something went wrong",
    });
  }
};
