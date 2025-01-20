import prisma from "../../../../../prisma/client";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const instructionId = req.url.split("shippinginstruction/")[1];
    const shippingInstruction = await prisma.shippingInstruction.findFirst({
      where: {
        itemId: Number(instructionId),
      },
      include: {
        stuffingReportItems: {
          include: {
            consignee:true,
            salesAgent: true,
            container: {
              include: {
                shipper: true,
                deliverySite:true,
              },
            },
          },
        },
      },
    });
    if (shippingInstruction) {
      return NextResponse.json({
        status: 200,
        data: shippingInstruction,
      });
    } else {
      return NextResponse.json({
        status: 400,
        message: "No shipping instruction found with that identity",
      });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      status: 400,
      message: "something went wrong",
    });
  }
};

export const PUT = async (req: Request) => {
  try {
    const body = await req.json();
    const instructionId = req.url.split("shippinginstruction/")[1];
    const shippingInstruction = await prisma.shippingInstruction.update({
      where: {
        itemId: Number(instructionId),
      },
      data: body,
    });
    if (shippingInstruction) {
      return NextResponse.json({
        status: 200,
        message: "Shipping instruction is prepared successfully",
      });
    } else {
      return NextResponse.json({
        status: 400,
        message: "No shipping instruction found with that identity",
      });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      status: 400,
      message: "something went wrong",
    });
  }
};
