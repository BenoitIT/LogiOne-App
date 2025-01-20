
import prisma from "../../../../../../../prisma/client";
import { NextResponse } from "next/server";
export const revalidate = 0;
export const GET = async (req: Request) => {
  try {
    const stuffingRptItemId = req.url.split("detail/")[1];
    const stuffingRptItems = await prisma.stuffingreportItems.findFirst({
      where: {
        id: Number(stuffingRptItemId),
      },
    });
    return NextResponse.json({
      status: 200,
      data: stuffingRptItems,
    });
  } catch (err) {
    return NextResponse.json({
      status: 400,
      message: "Something went wrong",
    });
  }
};

export const PUT = async (req: Request) => {
  try {
    const stuffingRptItemId = req.url.split("detail/")[1];
    const body = await req.json();
    const dollarExchangeRate = await prisma.calculationDependancy.findFirst({});
    const consignee = body.consignee;
    const mark = body.mark ?? "";
    const salesAgent = body.salesAgent!;
    const code = body.code ?? "";
    const noOfPkgs = body.noOfPkgs;
    const typeOfPkg = body.typeOfPkg ?? "";
    const weight = body.weight;
    const handling = body.handling ?? 0;
    const cbm = body.cbm ?? 0;
    const description = body.description ?? "";
    const freight = body.freight ?? 0;
    const blFee = body.blFee ?? 0;
    const jb = body.blFee ?? 0;
    const inspection = body.inspection ?? 0;
    const insurance = body.insurance ?? 0;
    const localCharges = body.localCharges ?? 0;
    const recovery = body.recovery ?? 0;
    const carHanging = body.carHanging ?? 0;
    const totalUsd =
      freight +
      blFee +
      jb +
      inspection +
      localCharges +
      insurance +
      carHanging +
      recovery;
    const totalAed = totalUsd * (dollarExchangeRate?.aed ?? 3.66);
    const stuffingRptItems = await prisma.stuffingreportItems.update({
      where: {
        id: Number(stuffingRptItemId),
      },
      data: {
        consigneeId: consignee,
        code: code,
        mark: mark,
        salesAgent: salesAgent,
        noOfPkgs: noOfPkgs,
        typeOfPkg: typeOfPkg,
        weight: weight,
        line: body.line ?? 0,
        handling: handling,
        type: body.type,
        cbm: cbm,
        description: description,
        freight: freight,
        blFee: blFee,
        jb: jb,
        inspection: inspection,
        insurance: insurance,
        localCharges: localCharges,
        recovery: recovery,
        carHanging: carHanging,
        totalinwords: body.totalinwords,
        portOfdischarge: body.portOfdischarge,
        totalUsd: totalUsd,
        totalAed: totalAed,
        editedBy: body.editedBy,
        updatedAt: body.editedAt,
        createdAt: body.createdAt,
      },
    });
    if (stuffingRptItems) {
      await prisma.shippingInstruction.update({
        where: {
          itemId: Number(stuffingRptItemId),
        },
        data: {
          createdAt: body.createdAt,
        },
      });
      return NextResponse.json({
        status: 200,
        message: "shipment is update successfully",
      });
    }
    return NextResponse.json({
      status: 404,
      message: "could not find shipment",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      status: 400,
      message: "Something went wrong",
    });
  }
};
export const DELETE = async (req: Request) => {
  try {
    const stuffingRptItemId = req.url.split("detail/")[1];
    const stuffingRptItems = await prisma.stuffingreportItems.findFirst({
      where: {
        id: Number(stuffingRptItemId),
      },
      include: {
        invoice: true,
        shippingInstruction: true,
      },
    });
    if (stuffingRptItems?.invoice) {
      await prisma.invoice.deleteMany({
        where: {
          detailsId: stuffingRptItemId,
        },
      });
      await prisma.shippingInstruction.deleteMany({
        where: {
          itemId: Number(stuffingRptItemId),
        },
      });
    }
    const deletedItems = await prisma.stuffingreportItems.delete({
      where: {
        id: Number(stuffingRptItemId),
      },
    });
    if (deletedItems) {
      return NextResponse.json({
        status: 200,
        data: "The client's items are deleted from stuffing report.",
      });
    } else {
      return NextResponse.json({
        status: 400,
        message: "Deletion failed",
      });
    }
  } catch (err) {
    return NextResponse.json({
      status: 400,
      message: "Something went wrong",
    });
  }
};
