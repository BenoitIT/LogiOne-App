"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { HamburgerMenuIcon, Cross1Icon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
const NavBar = ({
  scollThresholdChanged,
}: {
  scollThresholdChanged: boolean;
}) => {
  const [displayMenus, setDisplayMenus] = useState(true);
  const router = useRouter();
  const session: any = useSession();
  const role = session?.data?.role;
  const handleLogin = () => {
    if (session?.data && role == "operation manager") {
      router.push("/opmanager");
    } else if (session?.data && role == "operation manager") {
      router.push("/dashboard");
    } else {
      router.push("/auth/login");
    }
  };
  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/auth/login";
  };
  return (
    <div
      className={`w-screen ${
        scollThresholdChanged
          ? "bg-white shadow-md"
          : " md:bg-gradient-to-tl md:from-transparent md:to-transparent bg-opacity-80 duration-75 bg-gradient-to-tl from-[#003472] to-white"
      }  h-auto px-14 py-6 flex justify-center items-center`}
    >
      <div
        className={`w-full flex flex-col md:flex-row justify-between ${
          scollThresholdChanged ? "text-[#003472]" : "text-white"
        }`}
      >
        <div className="flex  justify-between w-full md:w-fit">
          <Image src="/images/loginOne.png" width={100} height={100} alt="Logo" />
          <div
            onClick={() => setDisplayMenus(true)}
            className={`${!displayMenus ? "flex" : "hidden md:flex"} ${
              scollThresholdChanged
                ? "border-[#003472] px-6 h-8 hover:shadow-[#189bcc] text-[#003472]"
                : "border-white hover:shadow-white"
            } justify-center items-center md:hidden px-[10px]  rounded border`}
          >
            <HamburgerMenuIcon />
          </div>
          <div
            onClick={() => setDisplayMenus(false)}
            className={`${displayMenus ? "flex" : "hidden"} ${
              scollThresholdChanged
                ? "border-[#003472] px-6 h-8 hover:shadow-[#189bcc] text-[#003472]"
                : "border-white hover:shadow-white"
            } justify-center items-center md:hidden px-[10px]  rounded border `}
          >
            <Cross1Icon />
          </div>
        </div>
        <div
          className={`${
            displayMenus ? "flex" : "hidden md:flex"
          } flex-col md:flex-row gap-2  lg:gap-4 mt-0 lg:mt-1 items-end md:justify-center w-full`}
        >
          <p className="hover:bg-blue-400 md:hover:bg-transparent w-full md:w-fit text-end md:text-start p-2 rounded-sm">
            <a
              className="text-base capitalize"
              href="https://loginOneae.com/about-us"
            >
              About us
            </a>
          </p>
          <p className="hover:bg-blue-400 md:hover:bg-transparent w-full md:w-fit  text-end md:text-start p-2 rounded-sm">
            <a
              className="text-base capitalize"
              href="https://loginOneae.com/services"
            >
              services
            </a>
          </p>
          <p className="hover:bg-blue-400 w-full md:hover:bg-transparent md:w-fit text-end md:text-start p-2 rounded-sm">
            <Link className="text-base capitalize" href="/#contact">
              {"Let's talk"}
            </Link>
          </p>
          <p className="flex md:hidden hover:bg-blue-400 w-full md:hover:bg-transparent md:w-fit text-end md:text-start p-2 rounded-sm justify-end">
            <Link className="text-base capitalize" href="/auth/login">
              {role? "Dashboard" : "Login"}
            </Link>
          </p>
          <p
            className={`${
              !session?.data ? "hidden" : "flex"
            } md:hidden hover:bg-blue-400 w-full md:hover:bg-transparent md:w-fit text-end md:text-start p-2 rounded-sm justify-end`}
          >
            <span className="text-base capitalize" onClick={handleSignOut}>
              Logout
            </span>
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-2">
          <Button
            className={`hidden ${
              role ? "md:hidden" : "md:block"
            } relative text-white text-sm capitalize ${
              scollThresholdChanged
                ? "bg-[#003472] px-6 w-20 h-8 hover:bg-[#189bcc]"
                : "hover:bg-[#003472]  w-20  px-6 h-8 bg-[#189bcc]"
            } hover:cursor-pointer`}
            onClick={handleLogin}
          >
            <p className="absolute top-[5px]">login</p>
          </Button>
          <Button
            className={`hidden ${
              !role ? "md:hidden" : "md:block"
            } relative text-white text-sm capitalize ${
              scollThresholdChanged
                ? "bg-[#003472] px-2 w-fit  h-8 hover:bg-[#189bcc]"
                : "hover:bg-[#003472] px-2 w-fit  h-8 bg-[#189bcc]"
            } hover:cursor-pointer`}
            onClick={handleLogin}
          >
            <p className="-mt-[2px]">Dashboard</p>
          </Button>
          <Button
            className={`hidden ${
              !session?.data ? "md:hidden" : "md:block"
            } relative text-white text-sm capitalize ${
              scollThresholdChanged
                ? "hover:bg-[#003472]  w-20 h-8 bg-[#189bcc]"
                : "bg-[#003472]  w-20  h-8 hover:bg-[#189bcc]"
            } hover:cursor-pointer`}
            onClick={handleSignOut}
          >
            <p className="absolute top-[5px]">Logout</p>
          </Button>
        </div>
      </div>
    </div>
  );
};
export default NavBar;
