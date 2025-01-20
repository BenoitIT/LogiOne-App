"use client";
import jsPdf from "jspdf";
import html2Canvas from "html2canvas";
import { setPageTitle } from "@/redux/reducers/pageTitleSwitching";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { getInvoice, invoiceEndpoint } from "@/app/httpservices/invoices";
import { useParams } from "next/navigation";
import useSWR from "swr";
import Letter from "./letter";
import Loader from "@/appComponents/pageBlocks/loader";
import ErrorSection from "@/appComponents/pageBlocks/errorDisplay";
import { withRolesAccess } from "@/components/auth/accessRights";

const Page = () => {
  const divRef = useRef(null);
  const dispatch = useDispatch();
  const params: any = useParams();
  const invId = params?.id;
  const { data, isLoading, error } = useSWR(invoiceEndpoint, () =>
    getInvoice(Number(invId))
  );
  useEffect(() => {
    dispatch(setPageTitle("Release letter"));
  }, [dispatch]);

  const downLoadResease = async (name:string) => {
    try {
      const currentRelease = divRef?.current;
      if (currentRelease) {
        const canvas = await html2Canvas(currentRelease);
        const imgData = canvas?.toDataURL("image/png");
        const pdf = new jsPdf({
          orientation: "portrait",
          unit: "px",
          format: "a4",
        });
        const width = pdf.internal.pageSize.getWidth();
        const height = (canvas?.height * width) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, width, height);
        pdf.save(`${name}-release-letter.pdf`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Could not download the release letter.");
    }
  };
  if (data) {
    return (
      <Letter
        divRef={divRef}
        downLoadResease={downLoadResease}
        invoiceId={data.itemsId}
        itemsId={data.reportId}
      />
    );
  }
  if (isLoading) {
    return <Loader />;
  }
  if (error) {
    return <ErrorSection />;
  }
};
export default withRolesAccess(Page, ["head of finance"]) as React.FC;
