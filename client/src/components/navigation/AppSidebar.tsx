"use client";

import * as React from "react";
import {
  Home,
  ListOrdered,
  MessageSquareHeart,
  MessageSquareWarning,
  Utensils,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "./NavMain";
import { NavUser } from "../ui/nav-user";
import { useSession } from "next-auth/react";
import { getUser } from "@/helpers/getUser"; 
import { useMediaQuery } from "react-haiku";

// Client-side only component
function ClientOnlySidebar({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <>{children}</>;
}

// This is sample data.

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();
  const mobileView = useMediaQuery('(max-width: 700px)', false);
  // const currUser: User = session?.user as User;

  const [userData, setUserData] = React.useState<{
    username?: string;
    email?: string;
    profile_pic?: string;
  } | null>(null);

  React.useEffect(() => {
    if (session?.user?.accessToken) {
      getUser(session.user.accessToken)
        .then((data) => {
          setUserData(data?.user);
        })
        .catch((err) => console.error(err));
    }
  }, [session]);

  if (mobileView) {
    return null;
  }

  const data = {
    user: {
      name: userData?.username || "Guest",
      email: userData?.email || "guest@example.com",
      avatar: userData?.profile_pic || "",
    },
    navMain: [
      {
        title: "Home",
        url: "/",
        icon: Home,
        items: [
          {
            title: "History",
            url: "#",
          },
        ],
      },
      {
        title: "Categories",
        url: "/category",
        icon: Utensils,
        items: [
          {
            title: "Salads",
            url: "/category/salads",
          },
          {
            title: "Burgers",
            url: "/category/burgers",
          },
          {
            title: "Pizza",
            url: "/category/pizza",
          },
        ],
      },
      {
        title: "Orders",
        url: "#",
        icon: ListOrdered,
        items: [
          {
            title: "Introduction",
            url: "#",
          },
        ],
      },
      {
        title: "Memories",
        url: "#",
        icon: MessageSquareHeart,
        items: [
          {
            title: "General",
            url: "#",
          },
        ],
      },
    ],
    projects: [
      {
        name: "Support",
        url: "#",
        icon: MessageSquareWarning,
      },
    ],
  };

  return (
    <ClientOnlySidebar>
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader></SidebarHeader>
        <SidebarContent >
          <NavMain  items={data.navMain} />
          {/* <NavProjects projects={data.projects} /> */}
        </SidebarContent>  
        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </ClientOnlySidebar>
  );
}
