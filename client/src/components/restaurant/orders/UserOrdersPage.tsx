"use client";
import React, { useState, useEffect } from "react";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tabs } from "@/components/ui/tabs";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import UserOrdersList from "@/components/restaurant/orders/UserOrdersList";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { UseFetchOrders } from "@/hooks";
import { Order } from "@/types/Order";
import { getUser } from "@/helpers/getUser";
import { useInterval } from "react-haiku";

export default function UserOrdersPage() {
  const { data: session } = useSession();
  const accessToken = session?.user?.accessToken;
  const [userIdFromAPI, setUserIdFromAPI] = useState<string | null>(null);

  const userId = session?.user?.id || userIdFromAPI; // First try session, then API result
  const { status, allGroupedOrders, refreshOrders } =
    UseFetchOrders(accessToken);
  const [isLoading, setIsLoading] = useState(true);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const router = useRouter();
  // console.log("User:", user);

  // Get user ID from API if not available in session
  useEffect(() => {
    
    const fetchUserData = async () => {
      if (accessToken && !session?.user?.id) {
        try {
          const userData = await getUser(accessToken);
          setUserIdFromAPI(userData.user.id);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchUserData();
  }, [accessToken, session?.user?.id]);

  // Refresh orders every minute
  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshOrders();
    }, 2000);
    
    return () => clearInterval(intervalId);
  }, [refreshOrders]);

  // Filter orders by user ID and set loading state
  useEffect(() => {
    if (allGroupedOrders && userId) {
      // Filter orders to only show the current user's orders
      const filteredOrderGroups = allGroupedOrders.filter((orderGroup) => {
        return String(orderGroup.customer_id) === String(userId);
      });

      // Extract all individual orders from the filtered groups
      const allUserOrders = filteredOrderGroups.flatMap(
        (group) => group.orders || []
      );

      setUserOrders(allUserOrders);
      setIsLoading(false);
    }
  }, [status, allGroupedOrders, userId]);

  // If no auth token
  if (!accessToken) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 mx-auto max-w-md text-center">
        <div className="mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="120"
            height="120"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-300"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">
          Sign in to view your orders
        </h2>
        <p className="text-gray-500 mb-8">
          Track your orders, view history, and more
        </p>
        <div className="space-y-3">
          <Button
            size="lg"
            className="w-full bg-btnColor hover:bg-btnColorHover active:bg-btnColorActive"
            onClick={() => router.push("/user/sign-in")}
          >
            Sign In
          </Button>
        </div>
      </div>
    );
  }
  

  // If loading
  if (isLoading) {
    return (
      <div className="my-10 text-center flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-btnColor" />
        <p>{status || "Loading your orders..."}</p>
      </div>
    );
  }

  // Filter orders by status
  const pendingOrders = userOrders.filter(
    (order) => order.order_status.toLowerCase() === "pending"
  );

  const processingOrders = userOrders.filter(
    (order) => order.order_status.toLowerCase() === "processing"
  );

  const completedOrders = userOrders.filter(
    (order) => order.order_status.toLowerCase() === "completed"
  );

  const cancelledOrders = userOrders.filter(
    (order) => order.order_status.toLowerCase() === "cancelled"
  );

  // No orders found for this user
  if (userOrders.length === 0) {
    return (
      <div className="my-10 text-center p-8 bg-gray-50 rounded-lg max-w-[60rem] mx-auto">
        <p className="text-gray-500">You don&apos;t have any orders yet</p>
      </div>
    );
  }

  return (
    <Tabs defaultValue="all" className="w-full">
      <div className="flex justify-center">
        <TabsList className="my-2 rounded-full">
          <TabsTrigger value="all" className="rounded-full">
            All ({userOrders.length})
          </TabsTrigger>
          <TabsTrigger value="pending" className="rounded-full">
            Pending ({pendingOrders.length})
          </TabsTrigger>
          <TabsTrigger value="processing" className="rounded-full">
            Processing ({processingOrders.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="rounded-full">
            Completed ({completedOrders.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="rounded-full">
            Cancelled ({cancelledOrders.length})
          </TabsTrigger>
        </TabsList>
      </div>
      <Button
        onClick={refreshOrders}
        variant="outline"
        className="ml-auto mt-10"
      >
        Refresh Orders
      </Button>

      <TabsContent value="all" className="mt-10">
        <UserOrdersList orders={userOrders} />
      </TabsContent>

      <TabsContent value="pending">
        <UserOrdersList orders={pendingOrders} />
      </TabsContent>

      <TabsContent value="processing">
        <UserOrdersList orders={processingOrders} />
      </TabsContent>

      <TabsContent value="completed">
        <UserOrdersList orders={completedOrders} />
      </TabsContent>

      <TabsContent value="cancelled">
        <UserOrdersList orders={cancelledOrders} />
      </TabsContent>
    </Tabs>
  );
}
