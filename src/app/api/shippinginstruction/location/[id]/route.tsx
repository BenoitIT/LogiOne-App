import { convertTimestamp } from "@/app/utilities/dateFormat";
import prisma from "../../../../../../prisma/client";
import { NextResponse } from "next/server";
export const revalidate = 0;

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const locationId = req.url.match(/location\/(\d+)(?=\?)/)?.[1];
    const searchValue = searchParams.get("search") || "";
    const currentPage = Number(searchParams?.get("page")) || 1;
    const pageSize = 13;
    const offset = (currentPage - 1) * pageSize;
    const shippingInstructions = await prisma.shippingInstruction.findMany({
      where: {
        stuffingReportItems: {
          container: {
            deliverySite: {
              user: {
                id: Number(locationId),
              },
            },
          },
        },
        OR: [
          {
            stuffingReportItems: {
              consignee: {
                name: {
                  contains: searchValue,
                  mode: "insensitive",
                },
              },
            },
          },
          {
            stuffingReportItems: {
              salesAgent: {
                firstName: {
                  contains: searchValue,
                  mode: "insensitive",
                },
              },
            },
          },
          {
            stuffingReportItems: {
              salesAgent: {
                lastName: {
                  contains: searchValue,
                  mode: "insensitive",
                },
              },
            },
          },
        ],
      },
      include: {
        stuffingReportItems: {
          include: {
            consignee: true,
            salesAgent: true,
            container: {
              include: {
                deliverySite: true,
              },
            },
          },
        },
      },
      skip: offset,
      take: pageSize,
    });
    const instructionCount = await prisma.shippingInstruction.count({
      where: {
        stuffingReportItems: {
          container: {
            deliverySite: {
              user: {
                id: Number(locationId),
              },
            },
          },
        },
        OR: [
          {
            stuffingReportItems: {
              consignee: {
                name: {
                  contains: searchValue,
                  mode: "insensitive",
                },
              },
            },
          },
          {
            stuffingReportItems: {
              salesAgent: {
                firstName: {
                  contains: searchValue,
                  mode: "insensitive",
                },
              },
            },
          },
          {
            stuffingReportItems: {
              salesAgent: {
                lastName: {
                  contains: searchValue,
                  mode: "insensitive",
                },
              },
            },
          },
        ],
      },
    });
    const totalPages = Math.ceil(instructionCount / pageSize);
    const processedInstructions = shippingInstructions.map((instruction) => ({
      id: instruction.stuffingReportItems.id,
      customerName: instruction.stuffingReportItems.consignee.name,
      salesAgent:
        instruction.stuffingReportItems.salesAgent.firstName +
        " " +
        instruction.stuffingReportItems.salesAgent.lastName,
      destination:
        instruction.stuffingReportItems.container.deliverySite.country +
        "-" +
        instruction.stuffingReportItems.container.deliverySite.locationName,
      createdAt: convertTimestamp(instruction.createdAt?.toString()),
      updatedAt: convertTimestamp(instruction.updatedAt),
    }));

    return NextResponse.json({
      status: 200,
      data: processedInstructions,
      count: totalPages,
    });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ status: 500, message: "Internal Server Error" });
  }
};
