import { LuLayoutDashboard } from "react-icons/lu";
import { BsListUl } from "react-icons/bs";
import { GearIcon } from "@radix-ui/react-icons";
import { LiaShippingFastSolid, LiaSitemapSolid } from "react-icons/lia";
import { TbReport, TbUsersGroup } from "react-icons/tb";
import { FaRegCircleUser } from "react-icons/fa6";
import { MdMoveDown } from "react-icons/md";
import { BsCashCoin } from "react-icons/bs";
import { MdOutlineIntegrationInstructions } from "react-icons/md";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { GiPayMoney } from "react-icons/gi";
import { SiPayoneer } from "react-icons/si";
import { RiMessage2Line } from "react-icons/ri";

export const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: <LuLayoutDashboard />,
        label: "Dashboard",
        href: "/dashboard",
        visible: ["admin", "senior operation manager", "finance", "head of finance"],
      },
      {
        icon: <LuLayoutDashboard />,
        label: "Dashboard",
        href: "/opmanager",
        visible: ["operation manager"],
      },
      {
        icon: <MdOutlineIntegrationInstructions />,
        label: "Shipping instructions",
        href: "/opmanager/shipping-instructions",
        visible: ["operation manager"],
      },
      {
        icon: <MdOutlineIntegrationInstructions />,
        label: "Shipping instructions",
        href: "/dashboard/list",
        visible: ["admin", "senior operation manager", "finance", "head of finance","sales manager"],
      },
      {
        icon: <BsListUl />,
        label: "Stuffing reports",
        href: "/dashboard/stuffing-reports",
        visible: ["admin", "senior operation manager", "finance", "head of finance"],
      },
      {
        icon: <TbUsersGroup />,
        label: "Staff",
        href: "/dashboard/staff",
        visible: ["admin","senior operation manager"],
      },
      {
        icon: <LiaSitemapSolid />,
        label: "Destination sites",
        href: "/dashboard/sites",
        visible: ["admin", "senior operation manager"],
      },
      {
        icon: <LiaShippingFastSolid />,
        label: "Shippers",
        href: "/dashboard/shippers",
        visible: ["admin"],
      },
      {
        icon: <MdMoveDown />,
        label: "Customers",
        href: "/dashboard/consignees",
        visible: ["admin", "senior operation manager"],
      },
      {
        icon: <BsCashCoin />,
        label: "Invoices",
        href: "/dashboard/containerslist",
        visible: ["admin", "finance", "head of finance"],
      },
      {
        icon: <SiPayoneer />,
        label: "Containers payments",
        href: "/dashboard/containerspayment",
        visible: ["admin", "finance", "head of finance"],
      },
      {
        icon: <GiPayMoney />,
        label: "commissions",
        href: "/dashboard/commissions",
        visible: ["admin", "finance", "head of finance"],
      },
      {
        icon: <HiOutlineDocumentReport />,
        label: "Financial report",
        href: "/dashboard/finance",
        visible: ["admin", "finance", "head of finance"],
      },
      {
        icon: <TbReport />,
        label: "Performance report",
        href: "/dashboard/reports",
        visible: ["admin"],
      },
      {
        icon: <RiMessage2Line />,
        label: "Messages",
        href: "/dashboard/messages",
        visible: ["admin"],
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: <FaRegCircleUser />,
        label: "Profile",
        href: "/dashboard/profile",
        visible: [
          "admin",
          "senior operation manager",
          "operation manager",
          "finance",
          "head of finance",
          "sales manager"
        ],
      },
      {
        icon: <GearIcon />,
        label: "Settings",
        href: "/dashboard/settings",
        visible: ["admin","senior operation manager","head of finance"],
      },
    ],
  },
];
