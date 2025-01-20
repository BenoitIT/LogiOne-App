import { getStuffingReportsItemsInvoice } from "@/app/httpservices/stuffingReport";
import ErrorSection from "@/appComponents/pageBlocks/errorDisplay";
import Loader from "@/appComponents/pageBlocks/loader";
import Back from "@/components/ui/back";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import useSWR from "swr";

interface LetterProps {
  downLoadResease: (name:string) => void;
  divRef: any;
  itemsId: number;
  invoiceId: number;
}

const Letter = ({
  downLoadResease,
  divRef,
  itemsId,
  invoiceId,
}: LetterProps) => {
  const date = new Date();
  const session: any = useSession();
  const cacheKey = `stuffingreports/${itemsId}/invoice/${invoiceId}`;
  const { data, isLoading, error } = useSWR(cacheKey, () =>
    getStuffingReportsItemsInvoice(itemsId, invoiceId)
  );
  if (data) {
    return (
      <div className="w-full">
        <div className="w-full flex flex-col-reverse md:flex-row  justify-between mb-4 gap-2">
          <Back />
          <div className="flex gap-2 justify-end w-full">
            <Button variant="secondary" onClick={()=>downLoadResease(data?.consigneeId)}>
              Download
            </Button>
          </div>
        </div>
        <div
          className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-lg border border-gray-300"
          ref={divRef}
        >
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              loginOne LTD
            </h2>
            <div className="flex flex-col gap-2">
              <p className="text-gray-600 text-sm">Rwanda-Kigali</p>
              <p className="text-gray-600 text-sm">
                Email: info@superfreightservice.com
              </p>
              <p className="text-gray-600 text-sm">
                Tel: +250788713189 / 0799373436
              </p>
            </div>
          </section>
          <section className="mb-6">
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold text-gray-700 text-sm mb-3">
                Date: <span className="font-normal">{date.toDateString()}</span>
              </h3>
              <h3 className="font-semibold text-gray-700 text-sm">
                Warehouse Manager
              </h3>
              <h3 className="font-normal text-gray-700 text-sm">
                Dear Sir/Madam
              </h3>
              <h3 className="font-semibold text-gray-700 text-sm mb-3">
                Re: Authorization for Cargo Release
              </h3>
            </div>
            <p className="text-gray-700 mt-4 leading-relaxed text-sm">
              I hope this message finds you well. As the Finance Manager of
              loginOne ltd, I am writing to authorize the release of cargo from
              your facility to the designated consignee, {data?.consigneeId}, as
              per our agreed terms and conditions.
            </p>
          </section>
          <section className="mb-6">
            <div className="overflow-x-auto mt-4 text-gray-700 text-sm">
              <p>Details of the cargo to be released are as follows:</p>
              <div className="flex flex-col gap-1 my-2">
                <p>
                  <span className="font-semibold">Consignee Name:</span>
                  {data?.consigneeId}
                </p>
                <p>
                  <span className="font-semibold">Bill of Lading Number:</span>
                  {data?.blCode}
                </p>
                <p>
                  <span className="font-semibold">Container number:</span>{" "}
                  {data?.containerNo}
                </p>
                <p>
                  <span className="font-semibold">Release Date:</span>
                  {data?.approvedAt}
                </p>
              </div>
            </div>
          </section>
          <section className="mb-6">
            <p className="text-gray-700 mt-4 leading-relaxed text-sm w-[80%]">
              Should you require any further information or clarification,
              please do not hesitate to contact me directly.
            </p>
            <p className="text-gray-700 mt-4 leading-relaxed text-sm w-[80%]">
              Thank you for your cooperation and prompt attention to this
              matter.
            </p>
            <p className="text-gray-700 mt-4 leading-relaxed text-sm w-[80%]">
              N.B:{" "}
              <span className="font-semibold">
                Kindly keep in mind that this release authorization is based on
                finance issues only
              </span>
            </p>
          </section>

          <footer className="mt-8 text-gray-700 text-sm">
            <p>Sincerely,</p>
            <p className="font-semibold mt-2">Finance Manager</p>
            <p className="text-gray-700">loginOne</p>
            <p className="text-gray-700">Tel: {session?.data?.phone || "-"}</p>
          </footer>
        </div>
      </div>
    );
  }
  if (isLoading) {
    return <Loader />;
  }
  if (error) {
    return <ErrorSection />;
  }
};
export default Letter;
