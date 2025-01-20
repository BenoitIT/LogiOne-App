import prisma from "../../../../../prisma/client";
import { NextRequest, NextResponse } from "next/server";
import stuffingItemSchema from "../../validations/stuffingItem";
export const revalidate = 0;
export const DELETE = async (req: Request) => {
  try {
    const stuffingRptId = req.url.split("stuffingreports/")[1];
    const stuffingRpt = await prisma.stuffingreport.findFirst({
      where: {
        id: Number(stuffingRptId),
      },
    });
    if (stuffingRpt?.status?.toLowerCase() == "available") {
      const someItemsAdded = await prisma.stuffingreportItems.findMany({
        where: {
          stuffingreportid: Number(stuffingRptId),
        },
      });
      if (someItemsAdded.length < 1) {
        const stuffingRpttoDelete = await prisma.stuffingreport.delete({
          where: {
            id: Number(stuffingRptId),
          },
        });
        if (stuffingRpttoDelete) {
          return NextResponse.json({
            status: 200,
            message: "Stuffing report is deleted successfully",
          });
        }
      } else {
        const alldeleted = await prisma.stuffingreportItems.deleteMany({
          where: {
            stuffingreportid: Number(stuffingRptId),
          },
        });
        console.log("all deleted",alldeleted)
        if (alldeleted.count<1) {
          return NextResponse.json({
            status: 200,
            message: "Stuffing report is deleted successfully",
          });
        } else {
          return NextResponse.json({
            status: 400,
            message:
              "Confirm deleting.please",
          });
        }
      }
    } else if (stuffingRpt?.status?.toLowerCase() !== "available") {
      return NextResponse.json({
        status: 400,
        message: `This stuffing report can not be deleted. it is ${stuffingRpt?.status}`,
      });
    } else {
      return NextResponse.json({
        status: 404,
        message: "That stuffing report id is not found",
      });
    }
  } catch (err) {
    console.log("errr", err);
    return NextResponse.json({
      status: 400,
      message: "something went wrong",
    });
  }
};
export const GET = async (req: Request) => {
  try {
    const stuffingRptId = req.url.split("stuffingreports/")[1];
    const stuffingRpt = await prisma.stuffingreport.findFirst({
      where: {
        id: Number(stuffingRptId),
      },
    });
    const stuffingRptItems = await prisma.stuffingreportItems.findMany({
      where: {
        stuffingreportid: Number(stuffingRptId),
      },
      include: {
        container: {
          include: {
            shipper: true,
            deliverySite: true,
          },
        },
        shippingInstruction: true,
        consignee: true,
        salesAgent: true,
        invoice: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    if (stuffingRptItems) {
      const modifiedResponse = stuffingRptItems.map((item) => {
        return {
          id: item.id,
          shipperId: item.container.shipper.name,
          consigneeId: item.consignee.name,
          delivery: item.container.deliverySite.locationName,
          code: item.code,
          phone: item.consignee.phone,
          mark: item.mark,
          salesAgent: item.salesAgent.firstName,
          noOfPkgs: Intl.NumberFormat("en-Us").format(item.noOfPkgs),
          typeOfPkg: item.typeOfPkg,
          weight: Intl.NumberFormat("en-Us").format(item.weight),
          line: item.line,
          handling: item.handling,
          type: item.type,
          cbm: Intl.NumberFormat("en-Us").format(item.cbm),
          description: item.description,
          freight: Intl.NumberFormat("en-Us").format(item.freight),
          blFee: Intl.NumberFormat("en-Us").format(item.blFee),
          jb: Intl.NumberFormat("en-Us").format(item.jb),
          invoiceNo: item.invoiceNo,
          carHanging: Intl.NumberFormat("en-Us").format(item.carHanging),
          recovery: Intl.NumberFormat("en-Us").format(item.recovery),
          localCharges: Intl.NumberFormat("en-Us").format(item.localCharges),
          insurance: Intl.NumberFormat("en-Us").format(item.insurance),
          inspection: Intl.NumberFormat("en-Us").format(item.inspection),
          totalUsd: item.totalUsd,
          invoiceInfo: item.invoice,
          totalAed: Intl.NumberFormat("en-Us").format(item.totalAed),
          instructionPrepared: item.shippingInstruction[0]?.prepared ?? false,
        };
      });

      const totals = stuffingRptItems.reduce(
        (acc, item) => {
          acc.noOfPkgs += item.noOfPkgs || 0;
          acc.weight += item.weight || 0;
          acc.cbm += item.cbm || 0;
          acc.freight += item.freight || 0;
          acc.blFee += item.blFee || 0;
          acc.jb += item.jb || 0;
          acc.handling += item.handling || 0;
          acc.line += item.line || 0;
          acc.inspection += item.inspection || 0;
          acc.insurance += item.insurance || 0;
          acc.localCharges += item.localCharges || 0;
          acc.recovery += item.recovery || 0;
          acc.carHanging += item.carHanging || 0;
          acc.totalUsd += item.totalUsd || 0;
          acc.totalAed += item.totalAed || 0;
          return acc;
        },
        {
          noOfPkgs: 0,
          weight: 0,
          cbm: 0,
          freight: 0,
          blFee: 0,
          handling: 0,
          line: 0,
          jb: 0,
          inspection: 0,
          insurance: 0,
          localCharges: 0,
          recovery: 0,
          totalUsd: 0,
          totalAed: 0,
          carHanging: 0,
        }
      );

      return NextResponse.json({
        status: 200,
        data: { shipments: modifiedResponse, stuffingRpt, totals },
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
    const stuffingRptId = req.url.split("stuffingreports/")[1];
    const body = await req.json();
    const date = new Date();
    body.noOfPkgs = Number(body.noOfPkgs);
    body.weight = Number(body.weight);
    body.handling = Number(body.handling ?? 0);
    body.blFee = Number(body.blFee ?? 0);
    body.jb = Number(body.jb ?? 0);
    body.inspection = Number(body.inspection ?? 0);
    body.insurance = Number(body.insurance ?? 0);
    body.localCharges = Number(body.localCharges ?? 0);
    body.recovery = Number(body.recovery ?? 0);
    body.carHanging = Number(body.carHanging ?? 0);
    body.line = Number(body.line ?? 0);
    const validation = stuffingItemSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({
        message:
          validation.error.errors[0].path +
          " " +
          validation.error.errors[0].message,
        status: 400,
      });
    }
    const dollarExchangeRate = await prisma.calculationDependancy.findFirst({});
    const previousItem = await prisma.stuffingreportItems.findFirst({
      orderBy: {
        id: "desc",
      },
    });
    const checkIfStuffingReportCreated = await prisma.stuffingreport.findFirst({
      where: {
        id: Number(stuffingRptId),
      },
      include: {
        deliverySite: true,
      },
    });
    const currentlyRecordedData = await prisma.stuffingreportItems.findFirst({
      where: {
        stuffingreportid: Number(stuffingRptId),
      },
    });
    if (checkIfStuffingReportCreated) {
      const stuffingreportid = Number(stuffingRptId);
      const consignee = body.consignee;
      const mark = body.mark ?? "";
      const salesAgent = body.salesAgent ?? "";
      const code = checkIfStuffingReportCreated.deliverySite.siteCode ?? "";
      const noOfPkgs = body.noOfPkgs;
      const typeOfPkg = body.typeOfPkg ?? "";
      const weight = body.weight;
      const handling = body.handling ?? 0;
      const cbm = body.cbm ?? 0;
      const description = body.description ?? "";
      const freight = body.freight ?? 0;
      const blFee = body.blFee ?? 0;
      const jb = body.jb ?? 0;
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
      const invoiceNo =
        "INV" +
        stuffingRptId +
        "" +
        date.getFullYear() +
        "" +
        Number((previousItem?.id ?? 0) + 1);
      const stuffingReportCheck = await prisma.stuffingreport.findFirst({
        where: {
          id: Number(stuffingreportid),
        },
      });
      if (stuffingReportCheck?.status?.toLowerCase() != "available") {
        return NextResponse.json({
          status: 400,
          message: "No other shipment is allowed to be added",
        });
      }
      const isConsigneeinTHisContainer =
        await prisma.stuffingreportItems.findFirst({
          where: {
            consigneeId: Number(consignee),
            stuffingreportid: Number(stuffingRptId),
          },
        });
      if (isConsigneeinTHisContainer) {
        return NextResponse.json({
          status: 400,
          message:
            "You can not record the same customer twice on single stuffing report. We advice you to edit and extend first details provided on this customer.",
        });
      } else if (
        checkIfStuffingReportCreated.packagingType == "FCL" &&
        currentlyRecordedData?.id
      ) {
        return NextResponse.json({
          status: 400,
          message: "You can not insert morethan one record in full container",
        });
      } else {
        const stuffingreportItem = await prisma.stuffingreportItems.create({
          data: {
            stuffingreportid: stuffingreportid,
            salesAgentId: salesAgent,
            consigneeId: consignee,
            code: code,
            mark: mark,
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
            invoiceNo: invoiceNo,
            carHanging: carHanging,
            totalUsd: totalUsd,
            totalAed: totalAed,
            totalinwords: body.totalinwords,
            portOfdischarge: body.portOfdischarge,
            preparedBy: body.preparedBy,
            createdAt: body.createdAt,
          },
        });
        const shiipingInstruction = await prisma.shippingInstruction.create({
          data: {
            prepaidFreight: 0,
            prepaidBlFee: 0,
            prepared: false,
            finaldeliverId: 1,
            deliveryTerm: "",
            itemId: stuffingreportItem.id,
            portOfdischarge: "",
            createdAt: body.createdAt,
          },
        });
        const shippingRate =
          checkIfStuffingReportCreated.packagingType == "FCL"
            ? dollarExchangeRate?.freightRateFullCont
            : dollarExchangeRate?.freightRate;
        const totalCommissionTobePaid = Number(shippingRate) * handling;

        const commission = await prisma.commissions.create({
          data: {
            stuffingItemId: stuffingreportItem.id,
            handling: handling,
            rate: Number(shippingRate),
            agentId: salesAgent,
            totalAmount: totalCommissionTobePaid,
          },
        });
        return NextResponse.json({
          status: 201,
          message: "New shipment is successfully saved!",
          data: stuffingreportItem,
          instructions: shiipingInstruction,
          commission: commission,
        });
      }
    } else {
      return NextResponse.json({
        status: 400,
        message: "No stuffing report initialized",
      });
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      status: 400,
      message: "Failed to add new shipment",
    });
  }
};
export const PUT = async (req: Request) => {
  try {
    const stuffingreportId = req.url.split("stuffingreports/")[1];
    const body = await req.json();
    const stuffingreport = await prisma.stuffingreport.update({
      where: {
        id: Number(stuffingreportId),
      },
      data: body,
    });
    if (stuffingreport) {
      return NextResponse.json({
        status: 200,
        message: "Information are updated succesfully",
      });
    }
    return NextResponse.json({
      status: 404,
      message: "Coud not find stuffing report",
    });
  } catch (err) {
    return NextResponse.json({
      status: 400,
      message: "something went wrong",
    });
  }
};
