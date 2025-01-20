import prisma from "../../../../../../../prisma/client";
import { NextRequest, NextResponse } from "next/server";
export const revalidate = 0;
export const GET = async (req: Request) => {
  try {
    const stuffingRptItemId = req.url.split("invoice/")[1];
    const stuffingRptItems = await prisma.stuffingreportItems.findFirst({
      where: {
        id: Number(stuffingRptItemId),
      },
      include: {
        container: {
          include: {
            shipper: true,
            deliverySite:true,
          },
        },
        consignee: true,
        salesAgent: true,
        invoice: true,
      },
    });

    if (stuffingRptItems) {
      const modifiedResponse = {
        delivery:
          stuffingRptItems.container.deliverySite.country +
          "-" +
          stuffingRptItems.container.deliverySite.locationName,
        shipperId: stuffingRptItems.container.shipper.name,
        consigneeId: stuffingRptItems.consignee.name,
        consigneeLocation:
          stuffingRptItems.consignee.location??"-",
        code: stuffingRptItems.code,
        phone: stuffingRptItems.consignee.phone,
        mark: stuffingRptItems.mark,
        origin: stuffingRptItems.container.origin,
        destination: `${
          stuffingRptItems.consignee.location??
          "-" 
        }`,
        salesAgent:
          stuffingRptItems.salesAgent.firstName +
          " " +
          stuffingRptItems.salesAgent.lastName,
        noOfPkgs: stuffingRptItems.noOfPkgs,
        typeOfPkg: stuffingRptItems.typeOfPkg,
        weight: stuffingRptItems.weight,
        line: stuffingRptItems.line,
        containerNo: stuffingRptItems.container.code,
        handling: stuffingRptItems.handling,
        type: stuffingRptItems.type,
        cbm: stuffingRptItems.cbm,
        description: stuffingRptItems.description,
        freight: stuffingRptItems.freight,
        blFee: stuffingRptItems.blFee,
        blCode: stuffingRptItems.container.blCode,
        vat: stuffingRptItems.invoice[0]?.vat || 0.0,
        date: stuffingRptItems.invoice[0]?.createdAt,
        amountPaid: stuffingRptItems.invoice[0]?.amountPaid,
        recievedBy: stuffingRptItems.invoice[0]?.recievedBy,
        preparedBy: stuffingRptItems.preparedBy,
        approvedAt: stuffingRptItems.invoice[0]?.approvedAt,
        paymentStatus: stuffingRptItems.invoice[0]?.paidInFull,
        totalAmountInWords:
          stuffingRptItems.totalinwords  || "total",
        jb: stuffingRptItems.jb,
        invoiceNo: stuffingRptItems.invoiceNo,
        carHanging: stuffingRptItems.carHanging,
        insurance: stuffingRptItems.insurance ?? 0,
        inspection: stuffingRptItems.inspection ?? 0,
        localCharges: stuffingRptItems.localCharges ?? 0,
        recovery: stuffingRptItems.recovery ?? 0,
        totalUsd: stuffingRptItems.totalUsd,
        totalAed: stuffingRptItems.totalAed,
      };

      return NextResponse.json({
        status: 200,
        data: modifiedResponse,
      });
    }

    return NextResponse.json({
      status: 404,
      message: "That stuffing report is not found",
    });
  } catch (err) {
    return NextResponse.json({
      status: 400,
      message: "Something went wrong",
    });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const newInvoice = await prisma.invoice.create({
      data: {
        vat: body.vat,
        detailsId: body.detailsId,
        staffid: body.createdBy,
      },
    });
    if (newInvoice) {
      return NextResponse.json({
        status: 201,
      });
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      status: 400,
      message: "Could not generate invoice",
    });
  }
};

export const PUT = async (req: Request) => {
  try {
    const body = await req.json();
    const date = new Date();
    const currentDate = date.toDateString();
    const invoiceId = req.url.split("invoice/")[1];
    const stuffingRptItems = await prisma.stuffingreportItems.findFirst({
      where: {
        id: Number(invoiceId),
      },
      include: {
        invoice: {},
      },
    });
    const invoiceIdd = stuffingRptItems?.invoice[0]?.id;
    const invoice = stuffingRptItems?.invoice[0];

    if (!invoiceIdd) {
      return NextResponse.json({
        status: 404,
        message: "Invoice not found.",
      });
    }
    const currentTotal = stuffingRptItems.totalUsd;
    const totalAmountPaid = invoice?.amountPaid ?? 0;
    if (totalAmountPaid >= currentTotal) {
      return NextResponse.json({
        status: 400,
        message: "The invoice is already paid.",
      });
    }
    const newTotalAmountPaid = totalAmountPaid + body.amountPaid;
    const isPaidInFull = newTotalAmountPaid >= currentTotal;
    let updatedRecievedBy = invoice?.recievedBy || "";
    if (!updatedRecievedBy.includes(body.recievedBy)) {
      updatedRecievedBy = updatedRecievedBy
        ? `${updatedRecievedBy}, ${body.recievedBy}`
        : body.recievedBy;
    }
    const updatedInvoice = await prisma.invoice.update({
      where: { id: Number(invoiceIdd) },
      data: {
        amountPaid: newTotalAmountPaid,
        paidInFull: isPaidInFull,
        paidAt: currentDate,
        recievedBy: updatedRecievedBy,
      },
    });
    return NextResponse.json({
      status: 200,
      message: "Payment saved successfully",
      data: updatedInvoice,
    });
  } catch (err) {
    return NextResponse.json({
      status: 500,
      message: "An error occurred while processing the payment.",
    });
  }
};
