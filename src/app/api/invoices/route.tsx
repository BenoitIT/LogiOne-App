import prisma from "../../../../prisma/client";
import { NextResponse } from "next/server";

export const revalidate = 0;

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const searchValue = searchParams.get("search");
  const containerId = Number(searchParams?.get("contid"));
  const records = await prisma.invoice.findMany({
    where: {
      AND: [
        {
          details: {
            stuffingreportid: containerId,
          },
        },
        searchValue
          ? {
              OR: [
                {
                  details: {
                    container: {
                      code: {
                        contains: searchValue,
                        mode: "insensitive",
                      },
                    },
                  },
                },
                {
                  details: {
                    consignee: {
                      name: {
                        contains: searchValue,
                        mode: "insensitive",
                      },
                    },
                  },
                },
                {
                  details: {
                    consignee: {
                      phone: {
                        contains: searchValue,
                        mode: "insensitive",
                      },
                    },
                  },
                },
                {
                  details: {
                    invoiceNo: {
                      contains: searchValue,
                      mode: "insensitive",
                    },
                  },
                },
              ],
            }
          : {},
      ],
    },
    include: {
      details: {
        include: {
          consignee: true,
          container: true,
        },
      },
      createdBy: true,
    },
    orderBy: {
      id: "desc",
    },
  });

  const invoices = records.map((record) => {
    const paymentStatus = record.paidInFull
      ? "Paid"
      : record.amountPaid > 0
      ? "Partially paid"
      : "Unpaid";

    return {
      id: record.id,
      date: record.createdAt.toDateString(),
      consigneeName: record.details.consignee?.name || "-",
      containerId: record.details.container?.code || "N/A",
      origin: record.details.container?.origin || "-",
      createdBy: record.recievedBy || "-",
      createdById: record.createdBy?.id || 0,
      paymentStatus,
      amountPaid: Intl.NumberFormat("en-US").format(record.amountPaid),
      destination: record.details.consignee?.location
        ?? "Unknown",
      invoiceNo: record.details.invoiceNo || "N/A",
      balance:Intl.NumberFormat("en-US").format(record.details.totalUsd-record.amountPaid),
      releaseGenerated: record.releaseGenarated,
      totalUsd: Intl.NumberFormat("en-US").format(record.details.totalUsd),
      totalAed: Intl.NumberFormat("en-US").format(record.details.totalAed),
    };
  });

  return NextResponse.json({
    status: 200,
    data: { invoices },
  });
};
