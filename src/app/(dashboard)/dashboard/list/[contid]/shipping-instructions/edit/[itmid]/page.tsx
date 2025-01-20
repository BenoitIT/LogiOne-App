"use client";
import useSWR from "swr";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import {
  NewStuffingItem,
  NewStuffingItemErrors,
} from "@/interfaces/stuffingItem";
import SetpOneForm from "./(steps)/stepOne";
import StepTwoForm from "./(steps)/stepTwo";
import { useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { setPageTitle } from "@/redux/reducers/pageTitleSwitching";
import {
  getStuffingReportsItemsDetail,
  stuffingReportEndpoint,
} from "@/app/httpservices/stuffingReport";
import { withRolesAccess } from "@/components/auth/accessRights";
const Page = () => {
  const params: any = useParams();
  const itemsId = params?.id;
  const invoiceId = params?.itmid;
  const { data: item } = useSWR(stuffingReportEndpoint, () =>
    getStuffingReportsItemsDetail(Number(itemsId), Number(invoiceId))
  );
  const [newItemPayload, setItemsData] = useState<NewStuffingItem>({});
  const [errors, setValidationErrors] = useState<NewStuffingItemErrors>({});
  const [activeForm, setActiveForm] = useState<number>(1);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle("Update Shipping instruction"));
  }, [dispatch]);
  useEffect(() => {
    setItemsData(item);
  }, [item]);
  const ErrorLogger = (errorKey: string, errorMessage: string | null) => {
    setValidationErrors((prevState: NewStuffingItemErrors) => ({
      ...prevState,
      [errorKey]: errorMessage,
    }));
  };

  return (
    <div className="w-full min-h-[88vh] flex justify-center items-center">
      <Card className="mx-auto w-sm md:w-[700px] py-3 border-none">
        <CardHeader>
          <CardDescription className="text-center">
            Update needed details in provided fields. Note that all fields with
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
          ) : (
            <StepTwoForm
              setItemsData={setItemsData}
              setValidationErrors={setValidationErrors}
              errors={errors}
              ErrorLogger={ErrorLogger}
              newItemPayload={newItemPayload}
              setActiveForm={setActiveForm}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
export default withRolesAccess(Page, ["senior operation manager", "admin"]) as React.FC;
