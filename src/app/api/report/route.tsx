import prisma from "../../../../prisma/client";
import { NextResponse } from "next/server";
export const revalidate = 0;
export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
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
    },
  });
  const totalMonitaryValue = totalRevenueMade._sum.totalUsd;

  const totalCommission = await prisma.commissions.aggregate({
    _sum: {
      totalAmount: true,
      amountPaid: true,
    },
    where: {
      createdAt: {
        gte: start,
        lt: end,
      },
    },
  });
  const totalHandling = totalCommission._sum.totalAmount;
  const totalPaidCommission = totalCommission._sum.amountPaid;
  const groupedSalesAgents = await prisma.stuffingreportItems.groupBy({
    by: ["salesAgentId"],
    _count: {
      salesAgentId: true,
    },
    where: {
      createdAt: {
        gte: start,
        lt: end,
      },
    },
  });
  const salesAgentIds = groupedSalesAgents.map((item) => item.salesAgentId);
  const salesAgents = await prisma.user.findMany({
    where: {
      id: { in: salesAgentIds },
    },
    take:8
  });

  const agentsResult = {
    numberOfAgents: salesAgents.length,
    agentsDetails: salesAgents.map((agent) => ({
      id: agent.id,
      firstName: agent.firstName,
      lastName: agent.lastName,
      phone: agent.phone,
    })),
  };
  const groupedCustomers = await prisma.stuffingreportItems.groupBy({
    by: ["consigneeId"],
    _count: {
      consigneeId: true,
    },
    where: {
      createdAt: {
        gte: start,
        lt: end,
      },
    },
  });
  const customerIds = groupedCustomers.map((customer) => customer.consigneeId);
  const customerDetails = await prisma.consignee.findMany({
    where: {
      id: {
        in: customerIds,
      },
    },
    take: 8,
  });
  const customersResult = {
    totalPaidCommission: totalPaidCommission,
    customersInfo: customerDetails.map((customer) => ({
      id: customer.id,
      customerName: customer.name,
      phone: customer.phone,
      tinnumber: customer.tinnumber,
    })),
  };
  return NextResponse.json({
    status: 200,
    data: {
      totalRevenueMade: totalMonitaryValue,
      agents: agentsResult,
      totalCommission: totalHandling,
      customers: customersResult,
    },
  });
};
