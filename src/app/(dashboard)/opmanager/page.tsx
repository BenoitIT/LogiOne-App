"use client";
import useSWR from "swr";
import { salerItemsheaders } from "@/app/tableHeaders/reportSalesAgent";
import { DashboardCardWrapper } from "@/components/dashboard/admin/CardWrapper";
import SalesFromSingleAgent from "@/components/dashboard/pages/singleAgentsales";
import DatePickerWithRange from "@/components/ui/dateSelector";
import { setPageTitle } from "@/redux/reducers/pageTitleSwitching";
import React from "react";
import { useEffect } from "react";
import { DateRange } from "react-day-picker";
import { GiTakeMyMoney } from "react-icons/gi";
import { useDispatch } from "react-redux";
import {
  getSalesReportFromSingleAgent,
  reportEndpoint,
} from "@/app/httpservices/salesReport";
import Loader from "@/appComponents/pageBlocks/loader";
import ErrorSection from "@/appComponents/pageBlocks/errorDisplay";
import { MdMoveDown } from "react-icons/md";
import { useSession } from "next-auth/react";

const ReportPage = () => {
  const session: any = useSession();
  const userId = session?.data?.id;
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  const dispatch = useDispatch();
  const { data, isLoading, error } = useSWR(
    date?.from && date?.to && userId
      ? [reportEndpoint, date.from, date.to, userId]
      : null,
    () =>
      getSalesReportFromSingleAgent(
        date?.from as unknown as string,
        date?.to as unknown as string,
        userId
      )
  );
  useEffect(() => {
    dispatch(setPageTitle("Home"));
  }, [dispatch]);
  if (data) {
    return (
      <div className="p-4 flex gap-4 flex-col m-auto justify-center">
        <div className="w-full flex justify-between">
          <DatePickerWithRange date={date} setDate={setDate} />
        </div>
        <div className="bg-white rounded shadow-sm flex justify-center w-full py-6">
          <p className="text-gray-800 uppercase font-medium md:text-base text-sm">
            {data?.agentName}
            {"'s"} Shipping records in{" "}
            {new Date().getDate() != date?.to?.getDate() ? "" : "last "}
            <span className="font-bold">
              {date && date.from && date.to
                ? Math.ceil(
                    (date.to.getTime() - date.from.getTime()) /
                      (1000 * 60 * 60 * 24)
                  )
                : 30}
            </span>{" "}
            days
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          <DashboardCardWrapper
            header="Total revenue"
            amount={`$ ${Intl.NumberFormat("en-Us").format(
              data?.totalRevenueMade
            )}`}
            perMonth="Were made"
            icon={<GiTakeMyMoney className="flex my-auto text-lg" />}
          />
          <DashboardCardWrapper
            header="Total commission"
            amount={`$ ${Intl.NumberFormat("en-Us").format(
              data?.totalCommission
            )}`}
            perMonth="Earned"
            icon={<GiTakeMyMoney className="flex my-auto text-lg" />}
          />
          <DashboardCardWrapper
            header="Commission"
            amount={`$ ${Intl.NumberFormat("en-Us").format(data?.customers)}`}
            perMonth="Recieved"
            icon={<MdMoveDown className="flex my-auto text-lg" />}
          />
          <DashboardCardWrapper
            header="Sales"
            amount={`${data?.sales?.length}`}
            perMonth="made"
            icon={<MdMoveDown className="flex my-auto text-lg" />}
          />
        </div>
        <div className="w-full grid grid-cols-1 gap-2">
          <div className="w-full bg-white p-2 rounded-md">
            <SalesFromSingleAgent
              headers={salerItemsheaders}
              data={data?.sales}
            />
          </div>
        </div>
      </div>
    );
  }
  if (isLoading) {
    return <Loader />;
  }
  if (error) {
    return <ErrorSection message={error.message}/>;
  }
};

export default ReportPage;
