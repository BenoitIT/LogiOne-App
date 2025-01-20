import prisma from "../../../../../../prisma/client";
import { NextResponse } from "next/server";
export const revalidate = 0;
export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const searchValue = searchParams.get("search");
  const locationId = req.url.match(/location\/(\d+)(?=\?)/)?.[1];
  const currentPage = Number(searchParams?.get("page")) || 1;
  const pageSize = 13;
  const offset = (currentPage - 1) * pageSize;
  const itemCount = await prisma.invoice.count({
    where: searchValue
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
      : {
          details: {
            container:{
              deliverySite:{
                agent:Number(locationId)
              }
            }
          },
        },
  });
  const records = await prisma.invoice.findMany({
    where: searchValue
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
      : {
          details: {
            container:{
              deliverySite:{
                agent:Number(locationId)
              }
            }
          },
        },
    include: {
      details: {
        include: {
          container:{
            include:{
            deliverySite:true,
            },
          },
          consignee:true
        },
      },
      createdBy: true,
    },
    skip: offset,
    take: pageSize,
  });
  const totalPages = Math.ceil(itemCount / pageSize);
  const invoices = records.map((record) => {
    const paymentStatus = record.paidInFull
      ? "Paid"
      : record.amountPaid > 0
      ? "Partially paid"
      : "Unpaid";
    return {
      id: record.id,
      date: record.createdAt.toDateString(),
      consigneeName: record.details.consignee.name,
      containerId: record.details.container.code,
      origin: record.details.container.origin,
      createdBy: record.createdBy.firstName,
      createdById: record.createdBy.id,
      paymentStatus: paymentStatus,
      amountPaid: Intl.NumberFormat("en-Us").format(record.amountPaid),
      destination:
        record.details.consignee.location +
        "," +
        record.details.consignee.location,
      invoiceNo: record.details.invoiceNo,
      releaseGenarated: record.releaseGenarated ? true : false,
      totalUsd: Intl.NumberFormat("en-Us").format(record.details.totalUsd),
      totalEud: Intl.NumberFormat("en-Us").format(record.details.totalAed),
    };
  });
  return NextResponse.json({
    status: 200,
    data: { invoices: invoices, count: totalPages },
  });
};
