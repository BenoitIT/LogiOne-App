"use client";
import useSWR from "swr";
import Invoice from "@/components/dashboard/pages/invoice";
import { getInvoice, invoiceEndpoint } from "@/app/httpservices/invoices";
import { useParams } from "next/navigation";
import Loader from "@/appComponents/pageBlocks/loader";
import ErrorSection from "@/appComponents/pageBlocks/errorDisplay";
import { withRolesAccess } from "@/components/auth/accessRights";

const Page = () => {
  const params = useParams();
  const invId = params?.invId;
  const { data, isLoading, error } = useSWR(invoiceEndpoint, () =>
    getInvoice(Number(invId))
  );
  if (data) {
    return <Invoice invoiceId={data.itemsId} itemsId={data.reportId} />;
  }
  if (isLoading) {
    return <Loader />;
  }
  if (error) {
    return <ErrorSection />;
  }
};
export default withRolesAccess(Page, ["senior operation manager", "admin", "finance","head of finance"]) as React.FC;
