import prisma from "../../../../../prisma/client";
import { NextResponse } from "next/server";

export const revalidate = 0;

interface ChartDataItem {
  month: string;
  revenue: number;
  expenses: number;
}

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const workPlace = searchParams.get("workplace");
  const isValidWorkPlace =
    workPlace && workPlace !== "null" && workPlace !== "";
  try {
    const stuffingReports = await prisma.stuffingreport.findMany({
      where: {
        stuffingstatus: "generated",
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
    });
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const defaultChartData: ChartDataItem[] = months.map((month) => ({
      month,
      revenue: 0,
      expenses: 0,
    }));

    const reportData = stuffingReports.reduce<ChartDataItem[]>(
      (acc, report) => {
        const totals = report.stuffingreportItems.reduce(
          (sum, item) => ({
            revenue: sum.revenue + Number(item.freight),
            totalLines: sum.totalLines + Number(item.line),
            totalHandling: sum.totalHandling + Number(item.handling),
            expenses:
              sum.expenses +
              Number(item.localCharges) +
              Number(item.jb) +
              Number(item.handling) * report.freightRate +
              Number(item.carHanging),
          }),
          { revenue: 0, totalLines: 0, totalHandling: 0, expenses: 0 }
        );

        const lessContainer =
          totals.totalLines < 42
            ? (42 - totals.totalLines - totals.totalHandling) *
              report.freightRate
            : 0;

        const expenses =
          totals.expenses +
          report.transportFee +
          report.extraCharges +
          lessContainer;

        const month = new Date(report.createdAt).toLocaleString("default", {
          month: "long",
        });

        const existingMonth = acc.find((entry) => entry.month === month);
        if (existingMonth) {
          existingMonth.revenue += totals.revenue;
          existingMonth.expenses += expenses;
        } else {
          acc.push({ month, revenue: totals.revenue, expenses });
        }

        return acc;
      },
      []
    );

    const finalChartData = defaultChartData.map((monthData) => {
      const reportMonthData = reportData.find(
        (report) => report.month === monthData.month
      );
      return reportMonthData || monthData;
    });

    return NextResponse.json({
      status: 200,
      chart: finalChartData,
    });
  } catch (err) {
    console.error("Error in stuffing report endpoint:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
