"use client";
import useSWR, { mutate } from "swr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setPageTitle } from "@/redux/reducers/pageTitleSwitching";
import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { LuPencilLine } from "react-icons/lu";
import { RxCross2 } from "react-icons/rx";
import { useDispatch } from "react-redux";
import {
  dependanceEndpoint,
  getDependancies,
  updateDepndancies,
} from "../../../httpservices/dependacies";
import Loader from "@/appComponents/pageBlocks/loader";
import ErrorSection from "@/appComponents/pageBlocks/errorDisplay";
import { toast } from "react-toastify";
import { withRolesAccess } from "@/components/auth/accessRights";
import { useSession } from "next-auth/react";

const Page = () => {
  const [editAEDValue, setEditAEDValue] = useState(false);
  const [editrate, setEditRate] = useState(false);
  const [editTransport1, setEditTransport1] = useState(false);
  const [editTransport2, setEditTransport2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aed, setAed] = useState<number>();
  const [rate, setRate] = useState<number>();
  const [rate2, setRate2] = useState<number>();
  const [groupageTransFee, setGroupageFee] = useState<number>();
  const [fullConatinerTransFee, setConatinerTransFee] = useState<number>();
  const [groupageSeaFee, setGroupageSeaFee] = useState<number>();
  const [fullConatinerSeaFee, setConatinerSeaFee] = useState<number>();
  const [editSeaFee1, setEditSeaFee1] = useState(false);
  const [editSeaFee2, setEditSeaFee2] = useState(false);
  const session: any = useSession();
  const workPlace = session?.data?.workCountry;
  const { data, isLoading, error } = useSWR(
    dependanceEndpoint,
    getDependancies
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle("Settings"));
  }, [dispatch]);
  useEffect(() => {
    if (data) {
      setAed(data?.aed || 1);
      setRate(data?.freightRate || 1);
      setRate2(data?.freightRateFullCont || 1);
      setGroupageFee(data?.groupageTransportFee);
      setConatinerTransFee(data?.fullTransportFee);
      setGroupageSeaFee(data?.groupageSeaFee);
      setConatinerSeaFee(data?.fullContSeaFee);
    }
  }, [data]);
  const handleUpdateInfo = async () => {
    setLoading(true);
    const payload = {
      aed: aed ?? data?.aed,
      freightRate: rate ?? data?.freightRate,
      freightRateFullCont: rate2 ?? data?.freightRateFullCont,
      groupageTransportFee: groupageTransFee ?? data?.groupageTransportFee,
      fullTransportFee: fullConatinerTransFee ?? data?.fullTransportFee,
      groupageSeaFee: groupageSeaFee ?? data?.groupageSeaFee,
      fullContSeaFee: fullConatinerSeaFee ?? data?.fullContSeaFee,
    };
    try {
      const response = await updateDepndancies(payload);
      if (response?.status == 200) {
        toast.success(response?.message);
        mutate(dependanceEndpoint);
      } else {
        toast.error(response?.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Update success");
    }
    setLoading(false);
  };
  if (data) {
    return (
      <div className="min-h-[80vh] flex justify-center items-center flex-col gap-2">
        <div className="h-full w-full md:h-[170px] md:w-[750px] bg-white rounded-xl shadow py-2">
          <div
            className={
              "w-full text-gray-600 mx-4 md:mx-8 flex flex-col gap-2 text-sm"
            }
          >
            <p className="font-semibold py-4 uppercase">
              USD to AED Conversion Rate
            </p>
            <p>
              Dollar(USD){" "}
              <span className="ml-8 text-gray-900 font-semibold">
                {data?.usd}$
              </span>
            </p>
            <div className="flex relative gap-2 flex-shrink">
              <p>
                United Arab Emirates dirham(AED){" "}
                <span className="text-gray-900 font-semibold">{data?.aed}</span>
              </p>
              <span
                className={
                  editAEDValue || !workPlace?.toLowerCase().includes("dubai")
                    ? "hidden"
                    : " text-[#003472] mt-[2px] hover:cursor-pointer"
                }
                onClick={() => setEditAEDValue(true)}
              >
                <LuPencilLine />
              </span>
              <div
                className={
                  editAEDValue
                    ? "flex flex-col md:flex-row gap-2 absolute left-[20px] md:left-[180px] bg-white p-2"
                    : "hidden"
                }
              >
                <Input
                  type="number"
                  placeholder="Enter value of 1$ in AED"
                  onChange={(e) => setAed(Number(e.target.value))}
                  value={aed}
                  className="w-full md:w-[270px] placeholder:text-gray-300 outline:border border-gray-400"
                />
                <Button onClick={handleUpdateInfo} disabled={loading}>
                  <FaCheck />
                </Button>
                <Button
                  variant="destructive"
                  disabled={loading}
                  onClick={() => {
                    setEditAEDValue(false);
                    setAed(data?.aed);
                  }}
                >
                  <RxCross2 />
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="h-full w-full md:h-[150px] md:w-[750px] bg-white rounded-xl shadow py-2">
          <div
            className={
              "w-full text-gray-600 mx-4 md:mx-8 flex flex-col text-sm"
            }
          >
            <p className="font-semibold py-4 uppercase">Shipping rate</p>
            <div className="flex relative gap-2 flex-shrink">
              <p>
                Rate (Groupage)
                <span className="text-gray-900 font-semibold ml-2">
                  {data?.freightRate}
                </span>
              </p>
              <span
                className={
                  editrate || !workPlace?.toLowerCase().includes("dubai")
                    ? "hidden"
                    : " text-[#003472] mt-[2px] hover:cursor-pointer"
                }
                onClick={() => setEditRate(true)}
              >
                <LuPencilLine />
              </span>
              <div
                className={
                  editrate
                    ? "flex flex-col md:flex-row gap-2 absolute left-[20px] md:left-[180px] bg-white p-2 -top-1"
                    : "hidden"
                }
              >
                <Input
                  type="number"
                  placeholder="Enter rate"
                  onChange={(e) => setRate(Number(e.target.value))}
                  value={rate || ""}
                  className="w-full md:w-[270px] placeholder:text-gray-300 outline:border border-gray-400"
                />
                <Button onClick={handleUpdateInfo} disabled={loading}>
                  <FaCheck />
                </Button>
                <Button
                  variant="destructive"
                  disabled={loading}
                  onClick={() => {
                    setEditRate(false);
                    setRate(data?.freightRate);
                  }}
                >
                  <RxCross2 />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="h-full w-full md:h-[150px] md:w-[750px] bg-white rounded-xl shadow py-2">
          <div
            className={
              "w-full text-gray-600 mx-4 md:mx-8 flex flex-col text-sm"
            }
          >
            <p className="font-semibold py-4 uppercase">Transport Fee</p>
            <div className="flex relative gap-2 flex-shrink">
              <p>
                Groupage
                <span className="text-gray-900 font-semibold ml-2">
                  {data?.groupageTransportFee}
                </span>
              </p>
              <span
                className={
                  editTransport1 || !workPlace?.toLowerCase().includes("dubai")
                    ? "hidden"
                    : " text-[#003472] mt-[2px] hover:cursor-pointer"
                }
                onClick={() => setEditTransport1(true)}
              >
                <LuPencilLine />
              </span>
              <div
                className={
                  editTransport1
                    ? "flex flex-col md:flex-row gap-2 absolute left-[20px] md:left-[180px] bg-white p-2 -top-1"
                    : "hidden"
                }
              >
                <Input
                  type="number"
                  placeholder="Enter rate"
                  onChange={(e) => {
                    setGroupageFee(Number(e.target.value));
                  }}
                  value={groupageTransFee || ""}
                  className="w-full md:w-[270px] placeholder:text-gray-300 outline:border border-gray-400"
                />
                <Button onClick={handleUpdateInfo} disabled={loading}>
                  <FaCheck />
                </Button>
                <Button
                  variant="destructive"
                  disabled={loading}
                  onClick={() => {
                    setEditTransport1(false);
                    setGroupageFee(data?.groupageTransportFee);
                  }}
                >
                  <RxCross2 />
                </Button>
              </div>
            </div>

            <div className="flex relative gap-2 flex-shrink mp mt-4">
              <p>
                Full container
                <span className="text-gray-900 font-semibold ml-2">
                  {data?.fullTransportFee}
                </span>
              </p>
              <span
                className={
                  editTransport2 || !workPlace?.toLowerCase().includes("dubai")
                    ? "hidden"
                    : " text-[#003472] mt-[2px] hover:cursor-pointer"
                }
                onClick={() => setEditTransport2(true)}
              >
                <LuPencilLine />
              </span>
              <div
                className={
                  editTransport2
                    ? "flex flex-col md:flex-row gap-2 absolute left-[20px] md:left-[180px] bg-white p-2 top-4"
                    : "hidden"
                }
              >
                <Input
                  type="number"
                  placeholder="Enter rate"
                  onChange={(e) => setConatinerTransFee(Number(e.target.value))}
                  value={fullConatinerTransFee || ""}
                  className="w-full md:w-[270px] placeholder:text-gray-300 outline:border border-gray-400"
                />
                <Button onClick={handleUpdateInfo} disabled={loading}>
                  <FaCheck />
                </Button>
                <Button
                  variant="destructive"
                  disabled={loading}
                  onClick={() => {
                    setEditTransport2(false);
                    setConatinerTransFee(data?.fullTransportFe);
                  }}
                >
                  <RxCross2 />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="h-full w-full md:h-[150px] md:w-[750px] bg-white rounded-xl shadow py-2">
          <div
            className={
              "w-full text-gray-600 mx-4 md:mx-8 flex flex-col text-sm"
            }
          >
            <p className="font-semibold py-4 uppercase">BL Fee</p>
            <div className="flex relative gap-2 flex-shrink">
              <p>
                Sea Fee(Groupage)
                <span className="text-gray-900 font-semibold ml-2">
                  {data?.groupageSeaFee}
                </span>
              </p>
              <span
                className={
                  editSeaFee1 || !workPlace?.toLowerCase().includes("dubai")
                    ? "hidden"
                    : " text-[#003472] mt-[2px] hover:cursor-pointer"
                }
                onClick={() => setEditSeaFee1(true)}
              >
                <LuPencilLine />
              </span>
              <div
                className={
                  editSeaFee1
                    ? "flex flex-col md:flex-row gap-2 absolute left-[20px] md:left-[180px] bg-white p-4 -top-1 ml-8"
                    : "hidden"
                }
              >
                <Input
                  type="number"
                  placeholder="Enter rate"
                  onChange={(e) => {
                    setGroupageSeaFee(Number(e.target.value));
                  }}
                  value={groupageSeaFee || ""}
                  className="w-full md:w-[270px] placeholder:text-gray-300 outline:border border-gray-400"
                />
                <Button onClick={handleUpdateInfo} disabled={loading}>
                  <FaCheck />
                </Button>
                <Button
                  variant="destructive"
                  disabled={loading}
                  onClick={() => {
                    setEditSeaFee1(false);
                    setGroupageSeaFee(data?.groupageSeaFee);
                  }}
                >
                  <RxCross2 />
                </Button>
              </div>
            </div>

            <div className="flex relative gap-2 flex-shrink mp mt-4">
              <p>
                Sea Fee (Full container)
                <span className="text-gray-900 font-semibold ml-2">
                  {data?.fullContSeaFee}
                </span>
              </p>
              <span
                className={
                  editSeaFee2 || !workPlace?.toLowerCase().includes("dubai")
                    ? "hidden"
                    : " text-[#003472] mt-[2px] hover:cursor-pointer"
                }
                onClick={() => setEditSeaFee2(true)}
              >
                <LuPencilLine />
              </span>
              <div
                className={
                  editSeaFee2
                    ? "flex flex-col md:flex-row gap-2 absolute left-[20px] md:left-[180px] bg-white p-2 top-4"
                    : "hidden"
                }
              >
                <Input
                  type="number"
                  placeholder="Enter rate"
                  onChange={(e) => setConatinerSeaFee(Number(e.target.value))}
                  value={fullConatinerSeaFee || ""}
                  className="w-full md:w-[270px] placeholder:text-gray-300 outline:border border-gray-400"
                />
                <Button onClick={handleUpdateInfo} disabled={loading}>
                  <FaCheck />
                </Button>
                <Button
                  variant="destructive"
                  disabled={loading}
                  onClick={() => {
                    setEditSeaFee2(false);
                    setConatinerSeaFee(data?.fullContSeaFee);
                  }}
                >
                  <RxCross2 />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (isLoading) {
    return <Loader />;
  }
  if (error) {
    return <ErrorSection message={error.message}/>;
  }
};
export default withRolesAccess(Page, ["senior operation manager", "admin"]) as React.FC;
