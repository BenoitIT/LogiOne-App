"use client";
import useSWR from "swr";
import { headers, headersCustomer } from "@/app/tableHeaders/reportSalesAgent";
import { DashboardCardWrapper } from "@/components/dashboard/admin/CardWrapper";
import AgentsInvolved from "@/components/dashboard/pages/agentsInvolved";
import ClientsInvolved from "@/components/dashboard/pages/clientsInvolved";
import DatePickerWithRange from "@/components/ui/dateSelector";
import { setPageTitle } from "@/redux/reducers/pageTitleSwitching";
import React from "react";
import { useEffect } from "react";
import { DateRange } from "react-day-picker";
import { FaEye } from "react-icons/fa6";
import { GiTakeMyMoney } from "react-icons/gi";
import { useDispatch } from "react-redux";
import { getSalesReport, reportEndpoint } from "@/app/httpservices/salesReport";
import Loader from "@/appComponents/pageBlocks/loader";
import ErrorSection from "@/appComponents/pageBlocks/errorDisplay";
import { TbUsersGroup } from "react-icons/tb";
import { MdMoveDown } from "react-icons/md";
import { usePathname, useRouter } from "next/navigation";
import Back from "@/components/ui/back";
import { withRolesAccess } from "@/components/auth/accessRights";
const ReportPage = () => {
  const router = useRouter();
  const currentPath = usePathname();
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  const dispatch = useDispatch();
  const { data, isLoading, error } = useSWR(
    date?.from && date?.to && [reportEndpoint, date.from, date.to],
    () =>
      getSalesReport(
        date?.from as unknown as string,
        date?.to as unknown as string
      )
  );
  useEffect(() => {
    dispatch(setPageTitle("Shipping report"));
  }, [dispatch]);
  const handleView = async (id: number) => {
    router.push(`${currentPath}/${id}`);
  };
  const actions = [
    {
      icon: (
        <button className="px-3 py-1 text-white bg-[#189bcc] rounded shadow-sm">
          <FaEye />
        </button>
      ),
      Click: handleView,
    },
  ];
  if (data) {
    return (
      <div className="p-4 flex gap-4 flex-col m-auto justify-center">
        <div className="w-full flex justify-between">
          <Back />
          <DatePickerWithRange date={date} setDate={setDate} />
        </div>
        <div className="bg-white rounded shadow-sm flex justify-center w-full py-6">
          <p className="text-gray-800 uppercase font-medium md:text-base text-sm">
            Shipping records in{" "}
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
            header="Sales agents"
            amount={`${data?.agents?.numberOfAgents}`}
            perMonth="Involved"
            icon={<TbUsersGroup className="flex my-auto text-lg" />}
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
            header="Total Commission"
            amount={`${Intl.NumberFormat("en-Us").format(
              data?.customers?.totalPaidCommission
            )}`}
            perMonth="Paid"
            icon={<MdMoveDown className="flex my-auto text-lg" />}
          />
        </div>
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-2">
          <div className="w-full bg-white p-2 rounded-md">
            <AgentsInvolved
              headers={headers}
              data={data?.agents?.agentsDetails ?? []}
              action={actions}
            />
          </div>
          <div className="w-full bg-white p-2 rounded-md">
            <ClientsInvolved
              headers={headersCustomer}
              data={data?.customers?.customersInfo}
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

export default withRolesAccess(ReportPage, ["senior operation manager", "admin"]) as React.FC;
