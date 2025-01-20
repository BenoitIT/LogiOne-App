"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useSWR from "swr";
import { setPageTitle } from "@/redux/reducers/pageTitleSwitching";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { convertDate, formatDate } from "@/app/utilities/dateFormat";
import Back from "@/components/ui/back";
import { ShippingReportPreparationDetails } from "./prepartion";
import { Button } from "@/components/ui/button";
import { getSingleShippinginstruction } from "@/app/httpservices/shippinginstruction";
import { useParams, usePathname, useRouter } from "next/navigation";
import { ShippingReportEditDetails } from "./editInfo";
import html2Canvas from "html2canvas";
import jsPDF from "jspdf";
import Loader from "@/appComponents/pageBlocks/loader";
import ErrorSection from "@/appComponents/pageBlocks/errorDisplay";
import { useSession } from "next-auth/react";

const ShippingInstruction = () => {
  const session: any = useSession();
  const documentRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const router = useRouter();
  const currentPath = usePathname();
  const itemsId = params?.instid;
  const containerid = params?.id;
  const staffId = session?.data?.id;
  const cacheKey = `/shippinginstruction/${itemsId}`;
  const dispatch = useDispatch();
  const [totalInwords, setTotalInwords] = useState<string>("");
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const { data, isLoading, error } = useSWR(cacheKey, () =>
    getSingleShippinginstruction(Number(itemsId))
  );
  useEffect(() => {
    dispatch(setPageTitle("Shipping instruction"));
  }, [dispatch]);
  const downLoadShippingInstruction = async () => {
    if (documentRef.current) {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const canvas = await html2Canvas(documentRef.current, {
          allowTaint: true,
          useCORS: true,
          logging: true,
          scale: 2,
          onclone: (document) => {
            const img = document.querySelector("img");
            if (img) {
              img.style.display = "block";
              img.crossOrigin = "anonymous";
            }
          },
        });
        console.warn("loaded", isImageLoaded);
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "px",
          format: "a4",
        });

        const width = pdf.internal.pageSize.getWidth();
        const height = (canvas.height * width) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, width, height);
        pdf.save(
          `${data?.stuffingReportItems?.consignee?.name}-shipping-instruction.pdf`
        );
      } catch (error) {
        console.error("PDF generation error:", error);
      }
    }
  };
  const payload = {
    detailsId: data?.stuffingReportItems?.invoiceNo,
    createdBy: staffId,
  };
  const handleOpenInvoice = async () => {
    router.push(`${currentPath}/invoice/${itemsId}`);
  };
  const logoSection = (
    <div className="w-[300px]">
      <img
        src="/images/loginOne.png"
        alt="logo"
        style={{ width: "250px", height: "auto" }}
        onLoad={() => setIsImageLoaded(true)}
        crossOrigin="anonymous"
      />
    </div>
  );
  if (error) {
    return <ErrorSection />;
  }
  if (isLoading) {
    return <Loader />;
  } else if (data) {
    return (
      <div className="w-full text-black">
        {/* {data?.totalAmountInWords == "total" ? ( */}
        <div
          className={
            "m-1 md:m-2 bg-white py-6 px-10 flex justify-between  max-w-[1200px] border border-gray-100 shadow-xl sticky top-16 z-10 rounded"
          }
        >
          <div className="flex gap-2 items-center">
            <Back />
            <h1 className="font-semibold uppercase hidden md:flex flex-wrap md:text-base">
              {!data?.prepared
                ? "Shipping instruction preview"
                : "Shipping instruction"}
            </h1>
          </div>
          <div className="flex gap-2 flex-wrap">
            <div className={data?.prepared ? "hidden" : "flex"}>
              <ShippingReportPreparationDetails
                cacheKey={cacheKey}
                itemsId={itemsId}
                containerid={containerid}
                invPayload={payload}
              />
            </div>
            <div className={!data?.prepared ? "hidden" : "flex"}>
              <ShippingReportEditDetails
                totalInwords={totalInwords}
                cacheKey={cacheKey}
                data={data}
                itemsId={itemsId}
                setTotalInwords={setTotalInwords}
              />
            </div>
            <Button
              variant="secondary"
              className={!data?.prepared ? "hidden" : "flex"}
              onClick={handleOpenInvoice}
            >
              View invoice
            </Button>
            <Button
              variant="secondary"
              className={!data?.prepared ? "hidden" : "flex"}
              onClick={downLoadShippingInstruction}
            >
              Download
            </Button>
          </div>
        </div>
        <div
          className="m-1 md:m-2 bg-white p-6 flex flex-col gap-2 max-w-[1200px] border border-gray-300 shadow-xl relative"
          ref={documentRef}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:w-[100%] w-full">
            {logoSection}
            <div className="md:text-sm text-xs w-full">
              <div className=" mb-2 w-full">
                <h1 className="text-xs md:text-base font-bold uppercase text-right w-full">
                  Super International Freight Services Company Ltd
                </h1>
              </div>
              <div className="flex flex-col gap-1  text-right w-full">
                <p className="uppercase">
                  Makuza Peace Plaza - 4<sup>th</sup> Floor/ Kigali - Rwanda
                </p>
                <p>Tel: +250788713189 / 0799373436</p>
                <p>
                  Email:{" "}
                  <a
                    href="mailto:info@superfreightservice.com"
                    className="underline text-blue-600"
                  >
                    info@superfreightservice.com
                  </a>
                </p>
                <p>TIN NUMBER: 121348946</p>
              </div>
            </div>
          </div>
          <div className="w-full text-base font-semibold py-3 mt-2">
            <p className="text-left capitalize">
              <span className="ml-0">
                Shipping instruction for container/rolo/air
              </span>
            </p>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="border border-b border-black">
                <TableCell
                  className="border-r-0 border-black text-black border-b font-bold uppercase"
                  colSpan={2}
                >
                  Sales executive:
                  <span className="cpaitalize w-full">
                    {data?.stuffingReportItems?.salesAgent?.firstName}
                  </span>
                </TableCell>
                <TableCell className="border-r border-black text-black"></TableCell>
                <TableCell className="border-r border-black text-black">
                  Date:
                  {formatDate(
                    data?.createdAt ? data?.createdAt : new Date().toISOString()
                  )}
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="border-l border-r border-black border-b w-16"></TableCell>
                <TableCell
                  className="border-l border-r border-black border-b capitalize"
                  colSpan={2}
                >
                  Shipper
                </TableCell>
                <TableCell className="border-l border-r border-black border-b">
                  Consignee
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="border-l border-r border-black border-b uppercase">
                  Names
                </TableCell>
                <TableCell
                  className="border-l border-r border-black border-b"
                  colSpan={2}
                >
                  {data?.stuffingReportItems?.container?.shipper?.name}
                </TableCell>
                <TableCell className="border-l border-r border-black border-b ">
                  {data?.stuffingReportItems?.consignee?.name}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="border-l border-r border-black border-b">
                  Address
                </TableCell>
                <TableCell
                  className="border-l border-r border-black border-b text-black"
                  colSpan={2}
                >
                  {data?.stuffingReportItems?.container?.shipper?.location}
                </TableCell>
                <TableCell className="border-l border-r border-black border-b uppercase">
                  {data?.stuffingReportItems?.consignee?.location}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="border-l border-r border-black border-b text-black">
                  Telephone
                </TableCell>
                <TableCell
                  colSpan={2}
                  className="border-l border-r border-black border-b"
                >
                  {data?.stuffingReportItems?.consignee?.phone}
                </TableCell>

                <TableCell className="border-l border-r border-black border-b uppercase">
                  {data?.stuffingReportItems?.container?.shipper?.phone}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  className="border-l border-r border-black border-b text-black uppercase"
                  colSpan={2}
                >
                  Port of discharge:
                </TableCell>
                <TableCell
                  colSpan={2}
                  className="border-l border-r border-black border-b"
                >
                  {data?.stuffingReportItems?.portOfdischarge?.length > 0
                    ? data?.stuffingReportItems?.portOfdischarge
                    : "-"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  className="border-l border-r border-black border-b text-black uppercase"
                  colSpan={2}
                >
                  Final place of delivery:
                </TableCell>
                <TableCell
                  colSpan={2}
                  className="border-l border-r border-black border-b"
                >
                  {data?.stuffingReportItems?.container?.deliverySite?.country +
                    "-" +
                    data?.stuffingReportItems?.container?.deliverySite
                      ?.locationName}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  className="border-l border-r border-black border-b text-black uppercase"
                  colSpan={2}
                >
                  Container No
                </TableCell>
                <TableCell
                  colSpan={2}
                  className="border-l border-r border-black border-b"
                >
                  {data?.stuffingReportItems?.container?.code}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  className="border-l border-r border-black border-b text-black uppercase"
                  colSpan={2}
                >
                  BL Number
                </TableCell>
                <TableCell
                  colSpan={2}
                  className="border-l border-r border-black border-b"
                >
                  {data?.stuffingReportItems?.container?.blCode}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  className="border-l border-r border-black border-b text-black uppercase"
                  colSpan={2}
                >
                  Weight:
                </TableCell>
                <TableCell
                  colSpan={2}
                  className="border-l border-r border-black border-b"
                >
                  {data?.stuffingReportItems?.weight} kg
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  className="border-l border-r border-black border-b text-black uppercase"
                  colSpan={2}
                >
                  LINE:
                </TableCell>
                <TableCell
                  colSpan={2}
                  className="border-l border-r border-black border-b"
                >
                  {data?.stuffingReportItems?.line}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  className="border-l border-r border-black border-b text-black uppercase"
                  colSpan={2}
                >
                  CBM:
                </TableCell>
                <TableCell
                  colSpan={2}
                  className="border-l border-r border-black border-b"
                >
                  {data?.stuffingReportItems?.cbm}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  className="border-l border-r border-black border-b text-black uppercase h-[100px] "
                  colSpan={4}
                >
                  <p className="-mt-10">
                    Description of goods:
                    <span className="lowercase ml-2">
                      {data?.stuffingReportItems?.description}
                    </span>
                  </p>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  className="border-l border-r border-black border-b text-black uppercase"
                  colSpan={2}
                >
                  Remark
                </TableCell>
                <TableCell
                  colSpan={2}
                  className="border-l border-r border-black border-b"
                ></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="border-l border-r border-black border-b text-black uppercase w-[200px] border-b-white"></TableCell>
                <TableCell className="border-l border-r border-black border-b w-auto md:w-[100px] lg:w-[200px]">
                  TYPE
                </TableCell>
                <TableCell className="border-l border-r border-black border-b w-auto md:w-[100px] lg:w-[200px]">
                  PREPAID
                </TableCell>
                <TableCell className="border-l border-r border-black border-b w-auto md:w-[100px] lg:w-[200px]">
                  COLLECT
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="border-l border-r border-black border-b text-black uppercase w-[200px] border-b-white"></TableCell>
                <TableCell className="border-l border-r border-black border-b w-auto md:w-[100px] lg:w-[200px]">
                  FREIGHT
                </TableCell>
                <TableCell className="border-l border-r border-black border-b w-auto md:w-[100px] lg:w-[200px]">
                  {Intl.NumberFormat("en-Us").format(data?.prepaidFreight)}
                </TableCell>
                <TableCell className="border-l border-r border-black border-b w-auto md:w-[100px] lg:w-[200px]">
                  {Intl.NumberFormat("en-Us").format(
                    data?.stuffingReportItems?.freight - data?.prepaidFreight
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="border-l border-r border-black border-b text-black uppercase w-[200px] border-b-white"></TableCell>
                <TableCell className="border-l border-r border-black border-b w-auto md:w-[100px] lg:w-[200px]">
                  B/L Fee
                </TableCell>
                <TableCell className="border-l border-r border-black border-b w-auto md:w-[100px] lg:w-[200px]">
                  {data?.prepaidBlFee}
                </TableCell>
                <TableCell className="border-l border-r border-black border-b w-auto md:w-[100px] lg:w-[200px]">
                  {Intl.NumberFormat("en-Us").format(
                    data?.stuffingReportItems?.blFee - data?.prepaidBlFee
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="border-l border-r border-black border-b text-black uppercase w-[200px] border-b-white"></TableCell>
                <TableCell className="border-l border-r border-black border-b w-auto md:w-[100px] lg:w-[200px]">
                  INSPECTION
                </TableCell>
                <TableCell className="border-l border-r border-black border-b w-auto md:w-[100px] lg:w-[200px]"></TableCell>
                <TableCell className="border-l border-r border-black border-b w-auto md:w-[100px] lg:w-[200px]">
                  {Intl.NumberFormat("en-Us").format(
                    data?.stuffingReportItems?.inspection
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="border-l border-r border-black border-b text-black uppercase w-[200px] border-b-white"></TableCell>
                <TableCell className="border-l border-r border-black border-b w-auto md:w-[100px] lg:w-[200px]">
                  LOADING/LASHING
                </TableCell>
                <TableCell className="border-l border-r border-black border-b w-auto md:w-[100px] lg:w-[200px]">
                  {data?.prepaidOthers ?? 0}
                </TableCell>
                <TableCell className="border-l border-r border-black border-b w-auto md:w-[100px] lg:w-[200px]">
                  {Intl.NumberFormat("en-Us").format(
                    data?.stuffingReportItems?.carHanging
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="border-l border-r border-black border-b text-black uppercase w-[200px] border-b-white"></TableCell>
                <TableCell className="border-l border-r border-black border-b w-auto md:w-[100px] lg:w-[200px]">
                  RECOVERY
                </TableCell>
                <TableCell className="border-l border-r border-black border-b w-auto md:w-[100px] lg:w-[200px]">
                  {data?.prepaidOthers ?? 0}
                </TableCell>
                <TableCell className="border-l border-r border-black border-b w-auto md:w-[100px] lg:w-[200px]">
                  {Intl.NumberFormat("en-Us").format(
                    data?.stuffingReportItems?.recovery
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="border-l border-r border-black border-b text-black uppercase w-[200px] border-b-white"></TableCell>
                <TableCell className="border-l border-r border-black border-b w-auto md:w-[100px] lg:w-[200px] uppercase">
                  Job advance
                </TableCell>
                <TableCell className="border-l border-r border-black border-b w-auto md:w-[100px] lg:w-[200px]">
                  {data?.prepaidOthers ?? 0}
                </TableCell>
                <TableCell className="border-l border-r border-black border-b w-auto md:w-[100px] lg:w-[200px]">
                  {Intl.NumberFormat("en-Us").format(
                    data?.stuffingReportItems?.jb
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="border-l border-r border-black border-b text-black uppercase w-[200px] border-b-white"></TableCell>
                <TableCell className="border-l border-r border-black border-b w-auto md:w-[100px] lg:w-[200px]">
                  INSURANCE
                </TableCell>
                <TableCell className="border-l border-r border-black border-b w-auto md:w-[100px] lg:w-[200px]">
                  {data?.prepaidOthers ?? 0}
                </TableCell>
                <TableCell className="border-l border-r border-black border-b w-auto md:w-[100px] lg:w-[200px]">
                  {Intl.NumberFormat("en-Us").format(
                    data?.stuffingReportItems?.insurance
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="border-l border-r border-black border-b text-black uppercase w-[200px] border-b-white"></TableCell>
                <TableCell className="border-l border-r border-black border-b w-auto md:w-[100px] lg:w-[200px]">
                  LOCAL CHARGES
                </TableCell>
                <TableCell className="border-l border-r border-black border-b w-auto md:w-[100px] lg:w-[200px]">
                  {data?.prepaidOthers ?? 0}
                </TableCell>
                <TableCell className="border-l border-r border-black border-b w-auto md:w-[100px] lg:w-[200px]">
                  {Intl.NumberFormat("en-Us").format(
                    data?.stuffingReportItems?.localCharges
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="border-l border-r border-black border-b text-black uppercase w-[200px]"></TableCell>
                <TableCell className="border-l border-r border-black border-b w-auto md:w-[100px] lg:w-[200px]">
                  TOTAL
                </TableCell>
                <TableCell className="border-l border-r border-black border-b w-auto md:w-[100px] lg:w-[200px]">
                  {data?.prepaidFreight + data?.prepaidBlFee}
                </TableCell>
                <TableCell className="border-l border-r border-black border-b w-auto md:w-[100px] lg:w-[200px]">
                  {Intl.NumberFormat("en-Us").format(
                    data?.stuffingReportItems?.freight -
                      (data?.prepaidFreight ?? 0) +
                      data?.stuffingReportItems?.blFee -
                      (data?.prepaidBlFee ?? 0) +
                      (data?.stuffingReportItems?.insurance ?? 0) +
                      (data?.stuffingReportItems?.recovery ?? 0) +
                      (data?.stuffingReportItems?.carHanging ?? 0) +
                      (data?.stuffingReportItems?.jb ?? 0) +
                      (data?.stuffingReportItems?.inspection ?? 0) +
                      (data?.stuffingReportItems?.localCharges ?? 0)
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  className="border-l border-r border-black border-b text-black uppercase"
                  colSpan={4}
                >
                  <span className="font-bold">
                    Amount in words:
                    <span className="ml-2 capitalize">
                      {data?.stuffingReportItems?.totalinwords}
                    </span>
                  </span>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  className="border-l border-r border-black border-b text-black  pt-8"
                  colSpan={4}
                >
                  <span>
                    I......................................................................................................
                  </span>
                  , agree the terms and condition of Super internation freight
                  services company ltd.
                </TableCell>
              </TableRow>
              <TableRow className="border-t border-t-white">
                <TableCell
                  className="border-l  border-black border-b text-black uppercase border-t border-t-white pt-8"
                  colSpan={2}
                >
                  Signature(sales)
                </TableCell>
                <TableCell className=" border-black border-b uppercase border-t-white pt-8">
                  signature(H.O.D)
                </TableCell>
                <TableCell className="border-r border-black border-b uppercase border-t-white pt-8">
                  signature(customer)
                </TableCell>
              </TableRow>
              <TableRow className="border-t border-t-white">
                <TableCell
                  className="border-l  border-black border-b text-black uppercase border-r font-bold"
                  colSpan={4}
                >
                  Shipping instruction received date:
                  <span className="ml-2">{convertDate(data?.updatedAt)}</span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <div className="m-4 flex flex-col gap-1 text-sm text-black">
            <p>
              1. If goods not cleared within 15 days of arrival at final
              destination, Super International Freight Services company ltd hold
              the right to auction the goods to recover our freight dues.
            </p>

            <p>
              2. Destination charges are not included and will be additional.
            </p>

            <p>
              3. Super International Freight Services company ltd will not be
              responsible for any claims with regards to damages-dents-pilferage
              accessories parts & general condition of the vehicle.
            </p>

            <p>
              4. Any overflow goods from LCL/FCL/Excess supplied should be moved
              within 30 days failing which storage will be charged AED
              10/CBM/Day.
            </p>

            <p>
              5. Super International Freight Services company ltd will hold the
              right to dispose the goods if not moved within 45 days.
            </p>

            <p>
              6. Customers are requested to submit full set of invoices/packing
              list for goods purchased, failure to do so would result in delays
              and additional cost for which super International Freight Services
              LLC will not be responsible.
            </p>

            <p>
              7. The goods and instructions are accepted and dealt with subject
              to the NAFL standard trading conditions (copy available on
              request).
            </p>

            <p>8. Insurance can be arranged upon request.</p>

            <p>
              9. Fragile/Glass items, Tiles/engines cargo must be packed in
              proper condition for safe transportation by Air & Sea. In case of
              improper packing Super International Freight Services company ltd
              will not be responsible for any damages or claims.
            </p>
          </div>
        </div>
        <div className="bg-white max-w-[1200px] flex justify-center ml-2 p-2">
          <div className="flex justify-center flex-col text-sm gap-1">
            <div className="flex flex-wrap gap-6">
              <p>
                Created by:
                <span
                  className={
                    data?.stuffingReportItems?.preparedBy
                      ? "ml-2 font-medium"
                      : "hidden"
                  }
                >
                  {data?.stuffingReportItems?.preparedBy ?? "-"}
                </span>
              </p>
              <p>
                Date:
                <span className={"ml-2 font-medium"}>
                  {formatDate(data?.stuffingReportItems?.createdAt) ?? "-"}
                </span>
              </p>
            </div>
            <div className={data?.stuffingReportItems?.editedBy!==""?"flex flex-wrap gap-6":"hidden"}>
              <p>
                Last editor:
                <span className="ml-2 font-medium">
                  {data?.stuffingReportItems?.editedBy ?? "-"}
                </span>
              </p>
              <p>
                Date:
                <span className="ml-2 font-medium">
                  {data?.stuffingReportItems?.updatedAt ?? "-"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <ErrorSection />;
  }
};

export default ShippingInstruction;
