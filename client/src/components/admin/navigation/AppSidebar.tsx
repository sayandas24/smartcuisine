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
import { NavMain } from "../../navigation/NavMain";
import { NavUser } from "../../ui/nav-user";
import { useSession } from "next-auth/react";
import { getUser } from "@/helpers/getUser";
import { useMediaQuery } from "react-haiku";
import { AdminNavMain } from "./AdminNavMain";
import { AdminSidebarProfile } from "./AdminSidebarProfile";

// FIXME: this is for hydration issue client side only component
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
  const mobileView = useMediaQuery("(max-width: 700px)", false);
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
      avatar: userData?.profile_pic || "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "Dashboard",
        url: "/admin/dashboard",
        icon: Home,
      },
      {
        title: "Category",
        url: "/admin/category",
        icon: MessageSquareWarning,
      },

      {
        title: "Orders",
        url: "/admin/orders",
        icon: ListOrdered,
      },
      {
        title: "Users",
        url: "/admin/users",
        icon: Utensils,
      },
    ],
  };

  return (
    <ClientOnlySidebar>
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader></SidebarHeader>
        <SidebarContent>
          <AdminNavMain items={data.navMain} />
          {/* <NavProjects projects={data.projects} /> */}
        </SidebarContent>
        <SidebarFooter> 
          <AdminSidebarProfile user={data.user} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </ClientOnlySidebar>
  );
}
