import { As } from "@chakra-ui/react";
import {
  MdAdd,
  MdDashboard,
  MdList,
  MdSupervisedUserCircle,
  MdVerifiedUser,
} from "react-icons/md";

type MenuItem = {
  icon?: As<any> | undefined;
  text: string;
  href?: string;
  children?: MenuItem[];
};

export const menu: MenuItem[] = [
  {
    icon: MdDashboard,
    text: "Dashboard",
    href: "/",
  },
  {
    icon: MdSupervisedUserCircle,
    text: "Notes",
    children: [
      {
        text: "Listing",
        href: "/notes",
        icon: MdList,
      },
      {
        text: "Create",
        href: "/notes/new",
        icon: MdAdd,
      },
    ],
  },
  // {
  //   icon: MdVerifiedUser,
  //   href: "/me",
  //   text: "Profile",
  // },
];
