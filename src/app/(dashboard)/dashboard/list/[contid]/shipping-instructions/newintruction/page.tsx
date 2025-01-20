"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import {
  NewStuffingItem,
  NewStuffingItemErrors,
  StuffingReportTotals,
} from "@/interfaces/stuffingItem";
import SetpOneForm from "./(steps)/stepOne";
import StepTwoForm from "./(steps)/stepTwo";
import { useDispatch } from "react-redux";
import { setPageTitle } from "@/redux/reducers/pageTitleSwitching";
import StepThree from "./(steps)/review";
import { getStuffingReportsItems } from "@/app/httpservices/stuffingReport";
import useSWR from "swr";
import { StuffingReport } from "@/interfaces/stuffingreport";
import { useParams } from "next/navigation";
import { withRolesAccess } from "@/components/auth/accessRights";
import { useSession } from "next-auth/react";
const Page = () => {
  const params = useParams();
  const staffReportId = params?.contid;
  const session: any = useSession();
  const userName = session?.data?.firstname;
  const [newItemPayload, setItemsData] = useState<NewStuffingItem>({
    type: "lines",
    preparedBy: userName ?? "",
  });
  const [errors, setValidationErrors] = useState<NewStuffingItemErrors>({});
  const [activeForm, setActiveForm] = useState<number>(1);
  const cacheKey = `/stuffingreports/${Number(staffReportId)}`;
  const { data, isLoading, error } = useSWR(
    [cacheKey],
    () => getStuffingReportsItems(Number(staffReportId)),
    {
      onSuccess: (data: {
        shipments: NewStuffingItem[];
        stuffingRpt: StuffingReport;
        totals: StuffingReportTotals;
      }) => data.shipments.sort((a, b) => (b.id ?? 0) - (a.id ?? 0)),
    }
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle("New shipping instruction"));
  }, [dispatch]);
  const ErrorLogger = (errorKey: string, errorMessage: string | null) => {
    setValidationErrors((prevState: NewStuffingItemErrors) => ({
      ...prevState,
      [errorKey]: errorMessage,
    }));
  };
  console.info(isLoading);
  console.info(error);
  return (
    <div className="w-full min-h-[88vh] flex justify-center items-center flex-col gap-2">
      <Card className="mx-auto w-sm md:w-[700px] py-3 border-none">
        <CardHeader>
          <CardTitle className="text-xl text-center">
            New shipping instruction
          </CardTitle>
          <CardDescription className="text-center">
            Enter all details in provided fields. Note that all fields with
            <br />
            <span className="text-sm">
              (<span className="text-red-500 text-base">*</span>) are mandatory
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeForm < 2 ? (
            <SetpOneForm
              setItemsData={setItemsData}
              setValidationErrors={setValidationErrors}
              errors={errors}
              ErrorLogger={ErrorLogger}
              newItemPayload={newItemPayload}
              setActiveForm={setActiveForm}
            />
          ) : activeForm == 2 ? (
            <StepTwoForm
              setItemsData={setItemsData}
              setValidationErrors={setValidationErrors}
              errors={errors}
              ErrorLogger={ErrorLogger}
              newItemPayload={newItemPayload}
              setActiveForm={setActiveForm}
            />
          ) : (
            <StepThree
              newItemPayload={newItemPayload}
              setActiveForm={setActiveForm}
              currentTotals={data?.totals}
              setItemsData={setItemsData}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
export default withRolesAccess(Page, ["senior operation manager","admin"]) as React.FC;
