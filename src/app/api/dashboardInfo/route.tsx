import prisma from "../../../../prisma/client";
import { NextResponse } from "next/server";
export const revalidate = 0;
export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const date = new Date();
  const currentMonth = date.getMonth() + 1;
  const currentYear = date.getFullYear();
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const workPlace = searchParams.get("workplace");
  const isValidWorkPlace =
    workPlace && workPlace !== "null" && workPlace !== "";
  const start = startDate
    ? new Date(startDate)
    : new Date(
        `${currentYear}-${currentMonth
          .toString()
          .padStart(2, "0")}-01T00:00:00.000Z`
      );
  const end = endDate
    ? new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1))
    : new Date(
        `${currentYear}-${(currentMonth + 1)
          .toString()
          .padStart(2, "0")}-01T00:00:00.000Z`
      );
  const totalRevenueMade = await prisma.stuffingreportItems.aggregate({
    where: isValidWorkPlace
      ? {
          container: {
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
          },
        }
      : undefined,
    _sum: {
      totalUsd: true,
    },
  });
  const totalRevenueMadeInThisMonth =
    await prisma.stuffingreportItems.aggregate({
      _sum: {
        totalUsd: true,
      },
      where: {
        createdAt: {
          gte: start,
          lt: end,
        },
        ...(isValidWorkPlace
          ? {
              container: {
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
              },
            }
          : {}),
      },
    });
  const revenuePercentage =
    ((totalRevenueMadeInThisMonth._sum.totalUsd ?? 0) * 100) /
      (totalRevenueMade._sum.totalUsd ?? 1) || 0;
  const totalMonitaryValue = totalRevenueMade._sum.totalUsd;
  const groupedCustomers = await prisma.consignee.aggregate({
    where: {
      ...(isValidWorkPlace
        ? workPlace.toLowerCase() == "rwanda"
          ? { location: { in: ["Rwanda", "DRC"], mode: "insensitive" } }
          : { location: { contains: workPlace, mode: "insensitive" } }
        : {}),
    },
    _count: {
      id: true,
    },
  });
  const CustomersCountThisMonth = await prisma.consignee.aggregate({
    _count: {
      id: true,
    },
    where: {
      createdAt: {
        gte: start,
        lt: end,
      },
      ...(isValidWorkPlace
        ? workPlace.toLowerCase() == "rwanda"
          ? { location: { in: ["Rwanda", "DRC"], mode: "insensitive" } }
          : { location: { contains: workPlace, mode: "insensitive" } }
        : {}),
    },
  });
  const customerPercentage =
    (CustomersCountThisMonth._count.id * 100) /
      (groupedCustomers._count.id ?? 1) || 0;
  const groupedStaffingReport = await prisma.stuffingreport.aggregate({
    where: {
      ...(isValidWorkPlace
        ? {
            deliverySite: {
              country: {
                equals: workPlace,
                mode: "insensitive",
              },
            },
          }
        : {}),
    },
    _count: {
      id: true,
    },
  });
  const groupedStaffingReportThisMonth = await prisma.stuffingreport.aggregate({
    _count: {
      id: true,
    },
    where: {
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
  });
  const staffingPercentage =
    (groupedStaffingReportThisMonth._count.id * 100) /
      (groupedStaffingReport._count.id ?? 1) || 0;
  const invoicesCount = await prisma.invoice.aggregate({
    where: {
      ...(isValidWorkPlace
        ? {
            details: {
              container: {
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
              },
            },
          }
        : {}),
    },
    _count: {
      id: true,
    },
  });
  const invoiceCountThisMonth = await prisma.invoice.aggregate({
    _count: {
      id: true,
    },
    where: {
      createdAt: {
        gte: start,
        lt: end,
      },
      ...(isValidWorkPlace
        ? {
            details: {
              container: {
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
              },
            },
          }
        : {}),
    },
  });
  const invoiceCountPercentage =
    (invoiceCountThisMonth._count.id * 100) / (invoicesCount._count.id ?? 1) ||
    0;
  const recentShipping = await prisma.stuffingreportItems.findMany({
    where: {
      createdAt: {
        gte: start,
        lt: end,
      },
      ...(isValidWorkPlace
        ? {
            container: {
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
            },
          }
        : {}),
    },
    include: {
      consignee: true,
    },
    orderBy: {
      id: "desc",
    },
    take: 5,
  });
  const simpleShippingRecord = recentShipping.map((shipping) => ({
    customerName: shipping.consignee.name,
    customerPhone: shipping.consignee.phone,
    amountEarned: shipping.totalUsd,
  }));
  const revenueByMonth = await prisma.stuffingreportItems.findMany({
    where: {
      ...(isValidWorkPlace
        ? {
            container: {
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
            },
          }
        : {}),
    },
    select: {
      createdAt: true,
      totalUsd: true,
    },
  });
  const monthlyRevenue = revenueByMonth.reduce((acc, item) => {
    const month = new Date(item.createdAt).getMonth()!;
    acc[month] = (acc[month] || 0) + (item.totalUsd || 0);
    return acc;
  }, {} as { [key: number]: number });
  const chartData = Array.from({ length: 12 }, (_, monthIndex) => {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return {
      month: monthNames[monthIndex],
      revenue: monthlyRevenue[monthIndex] || 0,
    };
  });
  return NextResponse.json({
    status: 200,
    data: {
      totalRevenueMade: totalMonitaryValue,
      revenuePercentagethisMonth: revenuePercentage,
      totalCustomers: groupedCustomers._count.id,
      customerPercentageThisMonth: customerPercentage,
      totalStuffingReport: groupedStaffingReport._count.id,
      staffingReportPercentage: staffingPercentage,
      totalInvoice: invoicesCount._count.id,
      invoiceCountPercentage: invoiceCountPercentage,
      recentShipping: simpleShippingRecord,
      chatRecords: chartData,
    },
  });
};
