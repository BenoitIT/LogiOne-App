"use client";
import useSWR from "swr";
import { DashboardCardWrapper } from "@/components/dashboard/admin/CardWrapper";
import RevenueChart from "@/components/dashboard/admin/RevenueChart";
import SalesPanel from "@/components/dashboard/admin/SalesPanel";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "@/redux/reducers/pageTitleSwitching";
import { BsCashCoin, BsListUl } from "react-icons/bs";
import { GiTakeMyMoney } from "react-icons/gi";
import { TbUsersGroup } from "react-icons/tb";
import {
  getDashboardinfo,
  dashboardEndpoint,
} from "@/app/httpservices/dashboard";
import Loader from "@/appComponents/pageBlocks/loader";
import ErrorSection from "@/appComponents/pageBlocks/errorDisplay";
import DatePickerWithRange from "@/components/ui/dateSelector";
import { DateRange } from "react-day-picker";
import { withRolesAccess } from "@/components/auth/accessRights";
import { useSession } from "next-auth/react";
import { loginOneApi } from "@/app/httpservices/axios";

const AdminPage = () => {
  const dispatch = useDispatch();
  const session: any = useSession();
  const workPlace = session?.data?.workCountry;
  const token = session?.data?.accessToken;
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  useEffect(() => {
    dispatch(setPageTitle("Home"));
    loginOneApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }, [dispatch,token]);
  const { data, isLoading, error } = useSWR(
    date?.from && date?.to && [dashboardEndpoint, date.from, date.to,token],
    () =>
      getDashboardinfo(
        date?.from as unknown as string,
        date?.to as unknown as string,
        workPlace
      )
  );
  if (data) {
    return (
      <div className=" flex lg:gap-4 gap-2 flex-col  m-auto justify-center">
        <div className="w-fit">
          <DatePickerWithRange date={date} setDate={setDate} />
        </div>
        <div className="w-full lg:gap-4 gap-2 h-fit grid lg:grid-cols-4 md:grid-cols-3 grid-cols-1">
          <DashboardCardWrapper
            header="Total revenue"
            amount={`$ ${Intl.NumberFormat("en-Us").format(
              data?.totalRevenueMade
            )}`}
            perMonth={`+${data?.revenuePercentagethisMonth}% from this month`}
            icon={<GiTakeMyMoney className="flex my-auto text-lg" />}
          />
          <DashboardCardWrapper
            header="Total customers"
            amount={`${Intl.NumberFormat("en-Us").format(
              data?.totalCustomers
            )}`}
            perMonth={`+${data?.customerPercentageThisMonth}% from this month`}
            icon={<TbUsersGroup className="flex my-auto text-lg" />}
          />
          <DashboardCardWrapper
            header="Total stuffing reports"
            amount={`${Intl.NumberFormat("en-Us").format(
              data?.totalStuffingReport
            )}`}
            perMonth={`+${data?.staffingReportPercentage}% from this month`}
            icon={<BsListUl className="flex my-auto text-lg" />}
          />
          <DashboardCardWrapper
            header="Invoices count"
            amount={`${Intl.NumberFormat("en-Us").format(data?.totalInvoice)}`}
            perMonth={`+${data?.invoiceCountPercentage}% from this month`}
            icon={<BsCashCoin className="flex my-auto text-lg" />}
          />
        </div>
        <div className="lg:h-[80vh] h-full w-full flex lg:flex-row flex-col lg:gap-4 gap-2">
          <RevenueChart data={data?.chatRecords} />
          <SalesPanel shippingData={data?.recentShipping} />
        </div>
      </div>
    );
  }
  if (isLoading) {
    return <Loader />;
  }
  if (error) {
    return <ErrorSection message={error.message} />;
  }
};

export default withRolesAccess(AdminPage, ["senior operation manager", "admin", "finance", "head of finance"]) as React.FC;
