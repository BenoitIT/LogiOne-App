import prisma from "../../../../prisma/client";
import { NextResponse } from "next/server";

export const revalidate = 0;
const formatCurrency = (amount: number): string => {
  return `$ ${Intl.NumberFormat("en-US").format(amount)}`;
};

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const currentPage = Number(searchParams?.get("page")) || 1;
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const workPlace = searchParams.get("workplace");
  const isValidWorkPlace =
    workPlace && workPlace !== "null" && workPlace !== "";
  const start = startDate
    ? new Date(startDate)
    : new Date(new Date().setDate(new Date().getDate() - 30));
  const end = endDate
    ? new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1))
    : new Date();
  const pageSize = 10;
  const offset = (currentPage - 1) * pageSize;
  try {
    const stuffingReports = await prisma.stuffingreport.findMany({
      where: {
        stuffingstatus: "generated",
        createdAt: {
          gte: start,
          lt: end,
        },
        ...(isValidWorkPlace
          ? {
              deliverySite: {
                country:
                  workPlace?.toLowerCase() == "rwanda"
                    ? {
                        in: ["Rwanda", "DRC"],
                        mode: "insensitive",
                      }
                    : {
                        equals: workPlace,
                        mode: "insensitive",
                      },
              },
            }
          : {}),
      },
      include: {
        stuffingreportItems: true,
      },
      skip: offset,
      take: pageSize,
    });
    const stuffingReportsCount = await prisma.stuffingreport.count({
      where: {
        stuffingstatus: "generated",
        createdAt: {
          gte: start,
          lt: end,
        },
      },
    });
    const totalPages = Math.ceil(stuffingReportsCount / pageSize);
    const modifiedResponse: any[] = stuffingReports.map((report) => {
      const totals = report.stuffingreportItems.reduce(
        (acc, item) => ({
          localCharges: acc.localCharges + Number(item.localCharges),
          freight: acc.freight + Number(item.freight),
          cashAdvance: acc.cashAdvance + Number(item.jb),
          handling: acc.handling + Number(item.handling),
          totalLines: acc.totalLines + Number(item.line),
          blFee: acc.blFee + Number(item.blFee),
          carHanging: acc.carHanging + Number(item.carHanging),
          totalUsd: acc.totalUsd + Number(item.totalUsd),
        }),
        {
          localCharges: 0,
          freight: 0,
          cashAdvance: 0,
          handling: 0,
          totalLines: 0,
          blFee: 0,
          carHanging: 0,
          totalUsd: 0,
        }
      );

      const handlingTotalAmount = totals.handling * report.freightRate;
      const lessContainer =
        totals.totalLines - totals.handling < 42
          ? (42 - (totals.totalLines - totals.handling)) * report.freightRate
          : 0;
      const profitAmount =
        totals.totalUsd -
        report.transportFee -
        report.seaFeee -
        report.extraCharges -
        totals.localCharges -
        totals.cashAdvance -
        totals.carHanging -
        handlingTotalAmount;
      return {
        id: report.id,
        containerNo: report.code,
        transportFee: formatCurrency(report.transportFee),
        clearingTransit: formatCurrency(totals.localCharges),
        lessContainer: formatCurrency(Math.abs(lessContainer)),
        totalUsdamt: formatCurrency(totals.totalUsd),
        cashAdvance: formatCurrency(totals.cashAdvance),
        nbrOfCustoms: report.stuffingreportItems.length,
        handling: formatCurrency(handlingTotalAmount),
        carHanging: formatCurrency(totals.carHanging),
        profit: formatCurrency(profitAmount),
        chargesToMombasa:
          report.extraCharges === 0
            ? "Not charged"
            : formatCurrency(report.extraCharges),
        ysf: formatCurrency(report.seaFeee),
      };
    });
    return NextResponse.json({
      status: 200,
      data: modifiedResponse,
      count: totalPages,
    });
  } catch (err) {
    console.error("Error in stuffing report endpoint:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
