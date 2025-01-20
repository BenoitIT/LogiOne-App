import { convertTimestamp } from "@/app/utilities/dateFormat";
import prisma from "../../../../prisma/client";
import { NextResponse } from "next/server";
export const revalidate = 0;

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const searchValue = searchParams.get("search");
  const currentPage = Number(searchParams?.get("page")) || 1;
  const pageSize = 13;
  const offset = (currentPage - 1) * pageSize;
  try {
    const commissionsCount = await prisma.commissions.count({
      where: {
        agent: {
          OR: [
            {
              firstName: {
                contains: searchValue || "",
                mode: "insensitive",
              },
            },
            {
              lastName: {
                contains: searchValue || "",
                mode: "insensitive",
              },
            },
          ],
        },
        handling: {
          gt: 0,
        },
      },
    });
    const commissions = await prisma.commissions.findMany({
      where: {
        agent: {
          OR: [
            {
              firstName: {
                contains: searchValue || "",
                mode: "insensitive",
              },
            },
            {
              lastName: {
                contains: searchValue || "",
                mode: "insensitive",
              },
            },
          ],
        },
        handling: {
          gt: 0,
        },
      },
      include: {
        agent: true,
      },
      orderBy: {
        id: "desc",
      },
      skip: offset,
      take: pageSize,
    });
    const totalPages = Math.ceil(commissionsCount / pageSize);
    const modifiedResponse = commissions.map((commission) => ({
      id: commission.id,
      date: convertTimestamp(commission.createdAt),
      agentName: commission.agent.firstName + " " + commission.agent.lastName,
      handling: commission.handling,
      rate: commission.rate,
      commission: commission.totalAmount,
      commissionPaid: commission.amountPaid,
      paymentstatus: commission.paymentStatus,
      paidAt: commission.paidAt ? convertTimestamp(commission.paidAt) : "-",
      paidBy: commission.paidBy.length > 0 ? commission.paidBy : "-",
    }));

    return NextResponse.json({
      status: 200,
      data: modifiedResponse,
      count: totalPages,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      status: 400,
    });
  }
};
