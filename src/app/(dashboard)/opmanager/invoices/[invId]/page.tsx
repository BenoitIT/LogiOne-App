"use client";
import { getInvoice, invoiceEndpoint } from "@/app/httpservices/invoices";
import ErrorSection from "@/appComponents/pageBlocks/errorDisplay";
import Invoice from "@/components/dashboard/pages/invoice";
import { Loader } from "lucide-react";
import { useParams } from "next/navigation";
import useSWR from "swr";
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
export default Page;
