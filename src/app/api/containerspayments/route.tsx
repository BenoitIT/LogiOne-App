import prisma from "../../../../prisma/client";
import { NextResponse } from "next/server";

export const revalidate = 0;

export const GET = async (request: Request) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code") || "KGL";
  const searchValue = url.searchParams.get("search");
  const currentPage = Number(url.searchParams?.get("page")) || 1;
  const workPlace = url.searchParams.get("workplace");
  const isValidWorkPlace =
    workPlace && workPlace !== "null" && workPlace !== "";
  const pageSize = 13;
  const offset = (currentPage - 1) * pageSize;
  const whereClause: any = {
    stuffingstatus: "generated",
    stuffingreportItems: {
      some: {
        code: code,
        OR: [{ code: { contains: searchValue, mode: "insensitive" } }],
      },
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
  };

  if (searchValue) {
    whereClause.OR = [{ code: { contains: searchValue, mode: "insensitive" } }];
  }
  const containers = await prisma.stuffingreport.findMany({
    where: whereClause,
    orderBy: { id: "desc" },
    include: {
      stuffingreportItems: {
        include: { invoice: true },
      },
    },
    skip: offset,
    take: pageSize,
  });
  const containersCount = await prisma.stuffingreport.count({
    where: whereClause,
  });
  const totalPages = Math.ceil(containersCount / pageSize);
  const modifiedResponse = containers.map((container) => {
    const totalAmount = container.stuffingreportItems.reduce(
      (sum, item) => sum + item.totalUsd,
      0
    );
    const itemsWithCode = container.stuffingreportItems.filter(
      (item) => item.code === code
    );
    const destinationCustomerCount = itemsWithCode.length;
    let paymentstatus = "unpaid";
    let destinationPaymentStatus = "unpaid";
    let totalAmountPaid = 0;
    let allInvoicesPaidInFull = true;
    let allItemsHaveInvoices = true;
    let latestPaidAt: any = null;
    container.stuffingreportItems.forEach((item) => {
      const invoice = item.invoice && item.invoice[0];
      if (invoice) {
        if (invoice.amountPaid > 0) {
          totalAmountPaid += invoice.amountPaid;
        }
        if (!invoice.paidInFull) {
          allInvoicesPaidInFull = false;
        }
        if (
          invoice.paidAt &&
          (!latestPaidAt || invoice.paidAt > latestPaidAt)
        ) {
          latestPaidAt = invoice.paidAt;
        }
      } else {
        allItemsHaveInvoices = false;
        allInvoicesPaidInFull = false;
      }
    });
    if (allItemsHaveInvoices && allInvoicesPaidInFull && totalAmountPaid > 0) {
      paymentstatus = "paid";
    } else if (totalAmountPaid > 0) {
      paymentstatus = "partially paid";
    }
    const destinationInvoices = itemsWithCode.map((item) => item.invoice?.[0]);
    const destinationAllInvoicesPaid = destinationInvoices.every(
      (invoice) => invoice && invoice.paidInFull
    );
    const destinationAnyInvoicePaid = destinationInvoices.some(
      (invoice) => invoice && invoice.amountPaid > 0
    );

    if (destinationAllInvoicesPaid) {
      destinationPaymentStatus = "paid in full";
    } else if (destinationAnyInvoicePaid) {
      destinationPaymentStatus = "partially paid";
    } else {
      destinationPaymentStatus = "unpaid";
    }

    return {
      id: container.id,
      containercode: container.code,
      totalAmount: Intl.NumberFormat("en-US").format(totalAmount),
      totalCustomerCount: container.stuffingreportItems.length,
      destinationCustomerCount: destinationCustomerCount,
      destinationPaymentStatus: destinationPaymentStatus,
      paymentstatus: paymentstatus,
      paymentdate: latestPaidAt || "",
      amountpaid: Intl.NumberFormat("en-US").format(totalAmountPaid),
      balance: Intl.NumberFormat("en-US").format(totalAmount - totalAmountPaid),
    };
  });

  return NextResponse.json({
    status: 200,
    data: modifiedResponse,
    count: totalPages,
  });
};
