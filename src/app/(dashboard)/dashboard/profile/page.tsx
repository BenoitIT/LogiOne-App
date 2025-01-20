"use client";
import { setPageTitle } from "@/redux/reducers/pageTitleSwitching";
import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { LuPencilLine } from "react-icons/lu";
import { FaCheck } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RxCross2 } from "react-icons/rx";
import { EditPasswordForm } from "./editPassword";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { usersBaseEndpoint } from "@/app/httpservices/axios";
import { getUser, updateUser } from "@/app/httpservices/users";
import Loader from "@/appComponents/pageBlocks/loader";
import ErrorSection from "@/appComponents/pageBlocks/errorDisplay";
import { NewStaff } from "@/interfaces/staff";
import { toast } from "react-toastify";
const Page = () => {
  const dispatch = useDispatch();
  const session: any = useSession();
  const userId = session?.data?.id;
  const [activeMenu, setActiveMenu] = useState("editprofile");
  const [editPhone, setEditPhone] = useState(false);
  const [data, setData] = useState<NewStaff>({});
  const {
    data: user,
    isLoading,
    error,
  } = useSWR(usersBaseEndpoint, () => getUser(Number(userId)));
  useEffect(() => {
    dispatch(setPageTitle("My Profile"));
  }, [dispatch]);
  useEffect(() => {
    setData(user);
  }, [user]);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setData((prevState: NewStaff) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const ProfileNavigators = [
    { id: 1, title: "Account Information", key: "editprofile" },
    { id: 2, title: "Edit Password", key: "security" },
  ];
  if (data) {
    return (
      <div className="w-full flex flex-col md:flex-row gap-8 justify-center items-center min-h-[80vh]">
        <div className="h-full min-w-fit md:min-h-[70vh] pt-6 flex justify-center items-center">
          <div className="h-[70px] w-[70px] md:h-[150px] md:w-[150px] bg-white rounded-full border border-gray-200 shadow-md flex justify-center items-center">
            <span className="text-xl md:text-6xl font-bold text-[#003472] uppercase">
              {data?.lastName && data?.lastName[0]}
              {data?.firstName && data?.firstName[0]}
            </span>
          </div>
        </div>
        <div className="h-full w-full md:h-[400px] md:w-[750px] bg-white rounded-xl shadow py-2">
          <div className="mb-[6vh] flex  w-fit text-base font-medium text-gray md:gap-4 gap-2  -z-10 mt-4 md:mx-8 mx-2">
            {ProfileNavigators.map((navigator) => (
              <div
                className={`${
                  navigator.key === activeMenu
                    ? "text-[#189bcc] border-b-2 border-[#cde3eb] rounded-sm"
                    : "text-[#003472]"
                } transition-opacity duration-150 ease-linear capitalize hover:cursor-pointer border-b pb-1 text-sm `}
                key={navigator.id}
                onClick={() => setActiveMenu(navigator.key)}
              >
                {navigator.title}
              </div>
            ))}
          </div>
          <div
            className={
              activeMenu == "editprofile"
                ? "w-full text-gray-500 mx-8 flex flex-col gap-2 text-sm"
                : "hidden"
            }
          >
            <p>
              First Name{" "}
              <span className="ml-8 text-gray-900 capitalize">
                {data?.firstName}
              </span>
            </p>
            <p>
              Last Name{" "}
              <span className="ml-8 text-gray-900 capitalize">
                {data?.lastName}
              </span>
            </p>
            <p>
              Email <span className="ml-8 text-gray-900">{data?.email}</span>
            </p>
            <div className="flex relative">
              <p>
                Telephone{" "}
                <span className="ml-8 text-gray-900">{data?.phone}</span>
              </p>
              <span
                className={
                  editPhone
                    ? "hidden"
                    : "ml-8 text-[#003472] mt-[2px] hover:cursor-pointer"
                }
                onClick={() => setEditPhone(true)}
              >
                <LuPencilLine />
              </span>
              <div
                className={
                  editPhone
                    ? "flex flex-col md:flex-row gap-2 absolute left-[20px] md:left-[180px] bg-white p-2"
                    : "hidden"
                }
              >
                <Input
                  type="text"
                  placeholder="Enter new phone number"
                  name="phone"
                  value={data?.phone}
                  className="w-full md:w-[270px] placeholder:text-gray-300 outline:border border-gray-400"
                  onChange={handleChange}
                />
                <Button
                  onClick={async () => {
                    const response = await updateUser(
                      Number(userId),
                      data
                    );
                    if (response?.status == 200) {
                      toast.success(response?.message);
                      setEditPhone(false);
                    } else {
                      toast.error(response?.message);
                    }
                  }}
                >
                  <FaCheck />
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setEditPhone(false)}
                >
                  <RxCross2 />
                </Button>
              </div>
            </div>
            <p>
              Role <span className="ml-8 text-gray-900">{data?.role}</span>
            </p>
            <p>
              Gender: <span className="ml-8 text-gray-900">{data?.gender}</span>
            </p>
            <p>
              Workplace country: <span className="ml-8 text-gray-900">{data?.workCountry}</span>
            </p>
          </div>
          <div className={activeMenu != "editprofile" ? "w-full" : "hidden"}>
            <EditPasswordForm userId={Number(userId)} />
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
export default Page;
