"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import useSWR from "swr";
import { useParams, useRouter } from "next/navigation";
import { setPageTitle } from "@/redux/reducers/pageTitleSwitching";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getStuffingReportsItems } from "@/app/httpservices/stuffingReport";
import { NewStuffingItem } from "@/interfaces/stuffingItem";
import { StuffingReport } from "@/interfaces/stuffingreport";
import { StuffingReportTotals } from "@/interfaces/stuffingItem";
import Loader from "@/appComponents/pageBlocks/loader";
import ErrorSection from "@/appComponents/pageBlocks/errorDisplay";
import { Button } from "@/components/ui/button";
import { withRolesAccess } from "@/components/auth/accessRights";

const Page = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const router = useRouter();
  const containerId = params?.id;
  const cacheKey = `/stuffingreports/${Number(containerId)}`;
  const { data, isLoading, error } = useSWR(
    [cacheKey],
    () => getStuffingReportsItems(Number(containerId)),
    {
      onSuccess: (data: {
        shipments: NewStuffingItem[];
        stuffingRpt: StuffingReport;
        totals: StuffingReportTotals;
      }) => data.shipments.sort((a, b) => (b.id ?? 0) - (a.id ?? 0)),
    }
  );
  useEffect(() => {
    dispatch(setPageTitle(`Container:${data?.stuffingRpt?.code ?? "-"}`));
  }, [dispatch, data]);
  if (data) {
    const totalAmountPaid = data.shipments.reduce(
      (acc: number, shipment: NewStuffingItem) => {
        const amountPaid = shipment.invoiceInfo?.[0]?.amountPaid ?? 0;
        return acc + amountPaid;
      },
      0
    );

    const totalAmountEarned = (data?.totals?.totalUsd ?? 0) - totalAmountPaid;
    return (
      <div className="p-6 flex justify-center bg-white rounded-sm text-sm min-h-[85vh]">
        <Accordion
          type="single"
          collapsible
          className="w-[80%] text-black opacity-90"
        >
          <div className="w-full flex justify-start">
            <Button className="-ml-2 lg:-ml-16" onClick={() => router.back()}>
              Back
            </Button>
          </div>
          <div className="p-3 w-fit rounded border-b border-gray-400">
            <p className="font-semibold">Container details</p>
            <p>
              <span>Container Number: {data?.stuffingRpt?.code}</span>
            </p>
            <p>
              <span>BL Number: {data?.stuffingRpt?.blcode}</span>
            </p>
            <p>Packaging type: {data?.stuffingRpt?.packagingType}</p>
            <p>
              Total amount from container:
              <span className="ml-2">
                {Intl.NumberFormat("en-Us").format(data?.totals?.totalUsd)} ${" "}
              </span>
            </p>
            <p>
              Total amount earned:{" "}
              <span className="ml-2">
                {Intl.NumberFormat("en-Us").format(totalAmountEarned)} ${" "}
              </span>
            </p>
          </div>
          {Array.isArray(data?.shipments) &&
            data.shipments.map((shipment: NewStuffingItem, index: number) => (
              <AccordionItem value={`item`} key={index}>
                <AccordionTrigger className="font-medium text-sm">
                  <span>
                    <span className="mr-2">{index + 1}.</span>
                    <em className="font-semibold">Consignee:</em>{" "}
                    {shipment.consigneeId}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-2  ml-4 md:ml-10">
                    <p className="font-semibold">Final destination code</p>
                    <p>{shipment.code}</p>
                    <p className="font-semibold">Sales agent</p>
                    <p>{shipment.salesAgent}</p>
                    <p className="font-semibold">Description</p>
                    <p>{shipment.description}</p>
                    <p className="flex flex-wrap gap-2">
                      <em>
                        CBM:
                        <span className="ml-1 font-bold">{shipment.cbm},</span>
                      </em>
                      <em>
                        Weight:
                        <span className="ml-1 font-bold">
                          {shipment.weight},
                        </span>
                      </em>
                      <em>
                        Number of packages:
                        <span className="ml-1 font-bold">
                          {shipment.noOfPkgs},
                        </span>
                      </em>
                      <em>
                        lines:
                        <span className="ml-1 font-bold">{shipment.line},</span>
                      </em>
                    </p>
                    <p className="font-semibold">Invoice</p>
                    {Number(shipment?.invoiceInfo?.length) > 0 ? (
                      <>
                        <em>
                          Invoice number:
                          <b className="ml-1">{shipment?.invoiceNo}</b>
                        </em>
                        <div className="grid grid-cols-3 w-fit gap-2">
                          <em>
                            Total amount to be paid:{" "}
                            <b className="text-gray-900">
                              {Intl.NumberFormat("en-Us").format(
                                Number(shipment?.totalUsd)
                              )}
                              .
                            </b>
                          </em>
                          <em>
                            Total amount paid:{" "}
                            <b className="text-gray-900">
                              {Intl.NumberFormat("en-Us").format(
                                Number(shipment.invoiceInfo?.[0]?.amountPaid)
                              )}
                            </b>
                          </em>
                          <em>
                            Balance:{" "}
                            <b className="text-gray-900">
                              {Intl.NumberFormat("en-Us").format(
                                Number(shipment?.totalUsd) -
                                  Number(shipment.invoiceInfo?.[0]?.amountPaid)
                              )}
                            </b>
                          </em>
                          <em>
                            status:{" "}
                            <b className="text-blue-900">
                              {shipment.invoiceInfo?.[0]?.amountPaid < 1
                                ? "Unpaid"
                                : shipment.invoiceInfo?.[0]?.paidInFull
                                ? "Paid"
                                : "Partially paid"}{" "}
                            </b>
                          </em>
                          <em>
                            Recieved by:{" "}
                            <b className="text-gray-900">
                              {shipment.invoiceInfo?.[0]?.recievedBy}
                            </b>
                          </em>
                        </div>
                      </>
                    ) : (
                      <em className="text-xs">
                        Invoice has not yet been created
                      </em>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
        </Accordion>
      </div>
    );
  }
  if (isLoading) {
    return <Loader />;
  }
  if (error) {
    return <ErrorSection />;
  }
};
export default withRolesAccess(Page, ["senior operation manager", "admin","finance","head of finance"]) as React.FC;
