import prisma from "../../../../../prisma/client";
import { NextResponse } from "next/server";
export const revalidate = 0;
export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const agentId = req.url.split("report/")[1][0];
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const start = startDate
    ? new Date(startDate)
    : new Date(new Date().setDate(new Date().getDate() - 30));
  const end = endDate
    ? new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1))
    : new Date();
  const totalRevenueMade = await prisma.stuffingreportItems.aggregate({
    _sum: {
      totalUsd: true,
    },
    where: {
      createdAt: {
        gte: start,
        lt: end,
      },
      salesAgentId: Number(agentId),
    },
  });
  const agentInfo = await prisma.user.findFirst({
    where: { id: Number(agentId) },
  });
  const agentName = agentInfo?.lastName;
  const totalMonitaryValue = totalRevenueMade._sum.totalUsd;
  const totalCommission = await prisma.commissions.aggregate({
    _sum: {
      totalAmount: true,
      amountPaid:true
    },
    where: {
      createdAt: {
        gte: start,
        lt: end,
      },
      agentId: Number(agentId),
    },
  });
  const totalHandling = totalCommission._sum.totalAmount;
  const totalHandlingPaid = totalCommission._sum.amountPaid;
  const stuffingRptItems = await prisma.stuffingreportItems.findMany({
    where: {
      salesAgentId: Number(agentId),
      createdAt: {
        gte: start,
        lt: end,
      },
    },
    include: {
      container: {
        include: {
          shipper: true,
        },
      },
      consignee: true,
      salesAgent: true,
      invoice: true,
    },
  });
  const modifiedResponse = stuffingRptItems.map((stuffingRptItem) => ({
    consigneeId: stuffingRptItem?.consignee?.name,
    phone: stuffingRptItem?.consignee?.phone,
    noOfPkgs: stuffingRptItem?.noOfPkgs,
    typeOfPkg: stuffingRptItem?.typeOfPkg,
    weight: stuffingRptItem?.weight,
    handling: stuffingRptItem?.handling,
    type: stuffingRptItem?.type,
    cbm: stuffingRptItem?.cbm,
    description: stuffingRptItem?.description,
    freight: stuffingRptItem?.freight,
    blFee: stuffingRptItem?.blFee,
    date: stuffingRptItem?.createdAt?.toDateString(),
    invoiceNo: stuffingRptItem?.invoiceNo,
    others:
      stuffingRptItem?.inspection +
      stuffingRptItem?.carHanging +
      stuffingRptItem?.localCharges +
      stuffingRptItem?.recovery,
    totalUsd: stuffingRptItem?.totalUsd,
    totalAed: stuffingRptItem?.totalAed,
  }));
  return NextResponse.json({
    status: 200,
    data: {
      totalRevenueMade: totalMonitaryValue,
      totalCommission: totalHandling,
      sales: modifiedResponse,
      customers: totalHandlingPaid,
      agentName: agentName,
    },
  });
};
