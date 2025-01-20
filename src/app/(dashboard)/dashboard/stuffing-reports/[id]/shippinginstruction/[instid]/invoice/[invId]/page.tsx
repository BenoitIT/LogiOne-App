"use client";
import { withRolesAccess } from "@/components/auth/accessRights";
import Invoice from "@/components/dashboard/pages/invoice";
import { useParams } from "next/navigation";

const Page = () => {
  const params: any = useParams();
  const itemsId = params?.id;
  const invoiceId = params?.invId;
  return (
    <Invoice itemsId={itemsId as number} invoiceId={invoiceId as number} />
  );
};
export default withRolesAccess(Page, ["senior operation manager", "admin"]) as React.FC;
