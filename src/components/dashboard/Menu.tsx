"use client";
import Image from "next/image";
import Link from "next/link";
import { menuItems } from "./staticData/routes";
import { usePathname } from "next/navigation";
import { FaSignOutAlt } from "react-icons/fa";
import { signOut, useSession } from "next-auth/react";
const Menu = () => {
  const session: any = useSession();
  const role = session?.data?.role;
  const pathname: string | null = usePathname();
  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };
  return (
    <div className="h-[96vh] flex flex-col justify-between w-full overflow-y-auto">
      <div>
      <Link
        href="/"
        className="flex justify-center z-10"
      >
        <Image src="/images/loginOne.png" className="-ml-12" alt="logo" width={100} height={100} />
      </Link>
      <div className="mt-8 text-sm ml-2">
        {menuItems[0].items.map((item) => {
          if (item.visible.includes(role)) {
            return (
              <Link
                href={item.href}
                key={item.label}
                className={`${
                  item.href == pathname
                    ? "text-[#003472] font-semibold"
                    : "text-gray-500 "
                } flex items-center justify-center lg:justify-start gap-4 opacity-95 py-2 md:px-2 rounded-md hover:text-[#003472] hover:font-semibold`}
              >
                {typeof item.icon === "string" ? (
                  <Image
                    src={item.icon}
                    alt={item.label}
                    width={20}
                    height={20}
                  />
                ) : (
                  <span className="text-lg font-thin -mt-[2px]">
                    {item.icon}
                  </span>
                )}
                <span className="hidden lg:block">{item.label}</span>
              </Link>
            );
          }
        })}
      </div>
      </div>

      <div className="mt-4 text-sm  ">
        {menuItems[1].items.map((item) => {
          if (item.visible.includes(role)) {
            return (
              <Link
                href={item.href}
                key={item.label}
                className={`${
                  item.href == pathname
                    ? "text-[#003472] font-semibold"
                    : "text-gray-500 "
                } flex items-center justify-center lg:justify-start gap-4 opacity-95 py-2 md:px-2 rounded-md hover:text-[#003472] hover:font-semibold`}
              >
                {typeof item.icon === "string" ? (
                  <Image
                    src={item.icon}
                    alt={item.label}
                    width={20}
                    height={20}
                  />
                ) : (
                  item.icon
                )}
                <span className="hidden lg:block">{item.label}</span>
              </Link>
            );
          }
        })}
        <button
          className={`text-gray-500  flex items-center justify-center lg:justify-start gap-4 opacity-95 py-2 md:px-2 rounded-md hover:text-[#003472] hover:font-semibold bg-transparent border-none`}
          onClick={handleSignOut}
        >
          <span>
            <FaSignOutAlt />
          </span>
          <span className="hidden md:block">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Menu;
