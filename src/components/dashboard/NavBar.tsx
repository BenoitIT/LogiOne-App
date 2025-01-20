"use client";
import { useAppSelector } from "@/redux/store";
import { useSession } from "next-auth/react";
const Navbar = () => {
  const pageTitle = useAppSelector((state) => state.pageTitle.pageTitle);
  const session:any = useSession();

  return (
    <div className="flex items-center justify-between p-4 bg-white shadow-sm w-full">
      <div className=" flex flex-shrink w-full items-left gap-2  [text-shadow:_0_1px_0_rgb(0_0_0_/_40%)] font-normal uppercase text-gray-800 text-sm md:text-lg">
        {pageTitle}
      </div>
      <div className="flex items-center gap-2 md:gap-4 justify-end w-full">
        <div className="flex flex-col">
          <span className="text-xs md:text-sm leading-3 font-medium text-gray-700 hidden md:flex capitalize">
            {session?.data?.lastname && session?.data?.firstname
              ? session?.data?.lastname + " " + session?.data?.firstname
              : ""}
          </span>
          <span className="text-[10px] text-gray-500 text-right">
            {session?.data?.role}
          </span>
        </div>
        <div className=" bg-white border font-semibold rounded-full w-9 h-9 flex items-center justify-center cursor-pointer text-[#003472] shadow-xl uppercase">
          {session?.data?.lastname && session?.data?.firstname
            ? session?.data?.lastname[0] + session?.data?.firstname[0]
            : ""}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
