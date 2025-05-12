"use client";

import React from "react";
import CartLogo from "./CartLogo";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import dynamic from "next/dynamic";

// Dynamically import BreadCrumbComponent with no SSR
const BreadCrumbComponent = dynamic(
  () => import("./BreadCrumbComponent"),
  { ssr: false }
);

export default function Header() {
  return (
    <header className="header flex items-center justify-between pr-5 max-[700px]:h-9 bg-[#ffffffd6] backdrop-blur-sm overflow-x-auto">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1 border max-[700px]:hidden" />
        <Separator orientation="vertical" className="mr-2 h-4 max-[700px]:hidden" />
        <BreadCrumbComponent />
      </div>
      {/* <CartLogo/> */}
    </header>
  );
}
