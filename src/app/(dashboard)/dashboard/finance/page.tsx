"use client";
import useSWR from "swr";
import { setPageTitle } from "@/redux/reducers/pageTitleSwitching";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import FinancialReport from "@/components/dashboard/pages/financialReprt";
import { FinancialRptHeaders } from "@/app/tableHeaders/financialreport";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { withRolesAccess } from "@/components/auth/accessRights";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  financialReportEndpoint,
  getFinancialReport,
  getFinancialReportchart,
} from "@/app/httpservices/financialReport";
import Loader from "@/appComponents/pageBlocks/loader";
import ErrorSection from "@/appComponents/pageBlocks/errorDisplay";
import Paginator from "@/components/pagination/paginator";
import { useRouter, useSearchParams } from "next/navigation";
import usePagination from "@/app/utilities/usePagination";
import { DateRange } from "react-day-picker";
import DatePickerWithRange from "@/components/ui/dateSelector";
import ExportButton from "@/components/ui/exportBtn";
import exportDataInExcel from "@/app/utilities/exportdata";
import { CgPlayListAdd } from "react-icons/cg";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateStuffingReport } from "@/app/httpservices/stuffingReport";
import { mutate } from "swr";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

const Page = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const session: any = useSession();
  const workPlace=session?.data?.workCountry;
  const activePage = searchParams?.get("page");
  const router = useRouter();
  const [amaount, setAmount] = useState(0);
  const [disable, setDisable] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [contId, setContId] = useState<number>();
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  const { data, isLoading, error } = useSWR(
    date?.from &&
      date?.to && [
        financialReportEndpoint,
        currentPage,
        date.from,
        date.to,
        disable,
      ],
    () =>
      getFinancialReport(
        workPlace,
        "",
        currentPage,
        date?.from as unknown as string,
        date?.to as unknown as string
      )
  );
  const {
    data: ChartInfo,
    isLoading: loading,
    error: isError,
  } = useSWR(financialReportEndpoint + "/chart", ()=>getFinancialReportchart(workPlace));
  useEffect(() => {
    dispatch(setPageTitle("Financial report"));
  }, [dispatch]);
  const { handlePageChange, handleNextPage, handlePreviousPage } =
    usePagination(data?.data, currentPage);
  useEffect(() => {
    if (activePage) {
      setCurrentPage(Number(activePage));
    }
  }, [activePage]);
  useEffect(() => {
    if (searchParams?.get("export")) {
      exportDataInExcel(
        data?.data,
        FinancialRptHeaders,
        `Financial report-${date?.from?.toDateString()} to ${date?.to?.toDateString()}`
      );
      router.back();
    }
  }, [searchParams, data?.data, router]);
  const chartConfig = {
    revenue: {
      label: "revenue",
      color: "hsl(var(--chart-2))",
    },
    expenses: {
      label: "expenses",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;
  const handleUpdateExtraCharges = async () => {
    setDisable(true);
    try {
      const { message, status } = await updateStuffingReport(Number(contId), {
        extraCharges: Number(amaount),
      });
      if (status == 200) {
        toast.success(message);
        mutate(financialReportEndpoint);
      } else {
        toast.error(message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Could not update information");
    }
    setDisable(false);
  };
  const handleRecord = async (id: number) => {
    setContId(id);
  };
  const actions = [
    {
      icon: (
        <Popover>
          <PopoverTrigger asChild>
            <span title="Add extra charges">
              <CgPlayListAdd className="text-2xl ml-4 text-blue-900" />
            </span>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none text-xs uppercase">
                  Recard extra charges during transport
                </h4>
                <p className="text-sm text-muted-foreground">
                  Set the amount of money
                </p>
              </div>
              <div className="grid gap-2">
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="width">Amount </Label>
                  <Input
                    id="amount"
                    type="number"
                    className="col-span-2 h-8"
                    onChange={(e) => setAmount(Number(e.target.value))}
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4 mt-2">
                  <Button
                    className="h-8 disabled:cursor-not-allowed"
                    onClick={handleUpdateExtraCharges}
                    disabled={disable}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      ),
      Click: handleRecord,
    },
  ];
  if (data) {
    return (
      <>
        <>
          <div className="w-full flex flex-col-reverse md:flex-row justify-between mb-4 gap-2">
            <div className="flex gap-2 justify-end w-full flex-col-reverse md:flex-row">
              <div className="h-fit">
                <DatePickerWithRange date={date} setDate={setDate} />
              </div>
              <ExportButton />
            </div>
          </div>
          <FinancialReport
            headers={FinancialRptHeaders}
            data={data?.data}
            action={actions}
          />
          <div className="flex justify-end w-full mt-2">
            <Paginator
              activePage={currentPage}
              totalPages={data?.count}
              onPageChange={handlePageChange}
              onPreviousPageChange={handlePreviousPage}
              onNextPageChange={handleNextPage}
            />
          </div>
        </>
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Annual report</CardTitle>
            <CardDescription>January - December</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart accessibilityLayer data={ChartInfo?.chart}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dashed" />}
                />
                <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
                <Bar
                  dataKey="expenses"
                  fill="var(--color-expenses)"
                  radius={4}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="leading-none text-muted-foreground">
              {loading
                ? "Loading chart"
                : isError
                ? "Error while loading chart"
                : "Showing total revenues and expenses for the last 12 months"}
            </div>
          </CardFooter>
        </Card>
      </>
    );
  }
  if (isLoading) {
    return <Loader />;
  }
  if (error) {
    return <ErrorSection message={error.message}/>;
  }
};
export default withRolesAccess(Page, [
  "finance",
  "admin",
  "head of finance",
]) as React.FC;
