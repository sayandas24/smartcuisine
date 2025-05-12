"use client";

import { Home, MessageSquareHeart, ShoppingBag, type LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";

import { Collapsible } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import SidebarItem from "./SidebarItem";
import CollapsableCategory from "./CollapsableCategory";
import { categoryLinks } from "@/data/categoryLinks";
import { fetchCategory } from "@/helpers/fetchCategory";
import { useLayoutEffect, useState } from "react";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const pathname = usePathname();
  // mark: change this categories from the categoryItem.ts
 

  const [categories, setCategories] =useState([]);
  
  const refreshCategories = async () => { 
      try {
        const data = await fetchCategory();
        setCategories(data.categories);
      } catch (err) {
        console.log('error in fetching category', err);
      } 
  };
  
  useLayoutEffect(() => {
    refreshCategories(); 
  }, []);


  return (
    <Collapsible defaultOpen className="group/collapsible">
      <SidebarGroup>
        <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarItem
            title="Home"
            url="/"
            icon={Home}
            isActive={pathname === "/"}
          />
          <CollapsableCategory
            isActive={pathname === "/category"}
            categories={categories}
          />
          <SidebarItem
            title="Memories"
            url="#"
            icon={MessageSquareHeart}
            isActive={pathname === "/memories"}
          />
          <SidebarItem
            title="Orders"
            url="/orders"
            icon={ShoppingBag}
            isActive={pathname === "/orders"}
          />
        </SidebarMenu>
      </SidebarGroup>
    </Collapsible>
  );
}
