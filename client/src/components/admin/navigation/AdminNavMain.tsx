"use client";

import {
  Home,
  MessageSquareHeart,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";

import { Collapsible } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { categoryLinks } from "@/data/categoryLinks";
import SidebarItem from "../../navigation/SidebarItem";
import CollapsableCategory from "../../navigation/CollapsableCategory";

export function AdminNavMain({
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
  // TODO: change this categories from the categoryItem.ts

  return (
    <Collapsible defaultOpen className="group/collapsible">
      <SidebarGroup>
        <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
        <SidebarMenu>
          {items.map((category) => (
            <SidebarItem
              key={category.title}
              title={category.title}
              isActive={pathname === category.url}
              url={category.url}
              icon={category.icon || Home}
            />
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </Collapsible>
  );
}
