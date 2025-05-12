"use client";
import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CustomerOrdered from "./CustomerOrdered";
import { useSession } from "next-auth/react";
import { CookingPot, CheckCircle2, XCircle, User } from "lucide-react";
import Image from "next/image"; 
import { Button } from "@/components/ui/button";
import UseFetchOrders from "@/hooks/UseFetchOrders";

export default function AdminOrders() {
  const { data: session } = useSession();
  const accessToken = session?.user?.accessToken;
  const { status, refreshOrders, allGroupedOrders } =
    UseFetchOrders(accessToken);

  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const nonPendingStatuses = ["processing", "completed", "cancelled"];
  
  const filteredOrderGroups = allGroupedOrders
    .filter(group => 
      !statusFilter || group.orders.some(order => 
        order.order_status.toLowerCase() === statusFilter.toLowerCase()
      )
    )
    .filter(group => 
      // And in all cases, only include groups where at least one order is not pending
      group.orders.some(order => 
        nonPendingStatuses.includes(order.order_status.toLowerCase())
      )
    );
 
    useEffect(() => {
      const intervalId = setInterval(() => {
        refreshOrders();
      }, 2000);
      
      return () => clearInterval(intervalId);
    }, [refreshOrders]);

  // If no orders or not authenticated yet
  if (!filteredOrderGroups || !accessToken) {
    return (
      <div className="my-10 text-center">
        <p>{status || "Loading..."}</p>
      </div>
    );
  }

  // Helper function to get status icon and color
  const getStatusDisplay = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "processing":
        return {
          icon: <CookingPot className="h-3 w-3" />,
          color: "text-orange-600",
          bgColor: "bg-orange-50",
        };
      case "completed":
        return {
          icon: <CheckCircle2 className="h-3 w-3" />,
          color: "text-green-600",
          bgColor: "bg-green-50",
        };
      case "cancelled":
        return {
          icon: <XCircle className="h-3 w-3" />,
          color: "text-red-600",
          bgColor: "bg-red-50",
        };
      default:
        return {
          icon: <CookingPot className="h-3 w-3" />,
          color: "text-gray-600",
          bgColor: "bg-gray-50",
        };
    }
  };
  

  return (
    <div className="my-10">
      {/* Status filter buttons */}
      <div className="flex flex-wrap gap-2 mb-4 max-w-[60rem] mx-auto px-4">
        <button
          onClick={() => setStatusFilter(null)}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            statusFilter === null
              ? "bg-gray-800 text-white"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          All
        </button>
        {nonPendingStatuses.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              statusFilter === status
                ? `bg-gray-800 text-white`
                : `bg-gray-100 hover:bg-gray-200 text-gray-700`
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
        <Button onClick={refreshOrders} variant="outline" className="ml-auto">
          Refresh Orders
        </Button>
      </div>

      {filteredOrderGroups.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg max-w-[60rem] mx-auto">
          <p className="text-gray-500">No orders with the selected status</p>
        </div>
      ) : (
        filteredOrderGroups.map((group) => {
          // Take the most recent order to display in the header (which is the first order in the group)
          const latestOrder = group.orders[0];
          const customer = latestOrder.customer;
          
          // Get dominant status for this group - prefer non-pending status if available
          const dominantStatus = group.orders.find(order => 
            nonPendingStatuses.includes(order.order_status.toLowerCase())
          )?.order_status || latestOrder.order_status;
          
          const { icon, color } = getStatusDisplay(dominantStatus);

          return (
            <Accordion
              key={`${group.customer_id}_${group.timestamp}`}
              type="single"
              collapsible
              className="max-w-[60rem] mx-auto mb-4"
            >
              <section className="flex justify-between w-full">
                <div className="text-xs text-gray-700 ml-2 mb-1 max-[600px]:hidden">
                  Ordered: {group.latestOrderTime}
                </div>
                <h1
                  className={`max-[600px]: text-[.8rem] ${color} flex items-center gap-2 mr-2`}
                >
                  {icon}
                  <span>
                    {dominantStatus.charAt(0).toUpperCase() +
                      dominantStatus.slice(1)}
                  </span>
                </h1>
              </section>
              <AccordionItem
                value="item-1"
                className="rounded-xl border shadow-sm"
              >
                <main className="flex gap-5 max-[600px]:gap-2 justify-between rounded-xl p-2 ">
                  <section className="flex gap-5 max-[600px]:gap-2 w-full justify-between">
                    {/* Customer image avatar */}
                    <div className="flex gap-5">
                      <div className="rounded-xl overflow-hidden h-[5rem] w-[5rem] border shrink-0 max-[350px]:w-[4rem] max-[350px]:h-[4rem] bg-gray-100 flex items-center justify-center">
                        {customer?.profile_pic ? (
                          <Image
                            src={customer.profile_pic}
                            alt={customer.name || "Customer"}
                            width={80}
                            height={80}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <User className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      {/* Customer name */}
                      <div className="mt-2 max-[350px]:mt-0">
                        <h3 className="text-[11px] text-gray-500">
                          Customer Name:
                        </h3>
                        <h1 className="max-[600px]: text-[.97rem]">
                          {customer?.name || "Unknown Customer"}
                        </h1>
                      </div>
                    </div>
                    {/* Customer email */}
                    <div className="mt-2 max-[350px]:mt-0">
                      <h3 className="text-[11px] text-gray-500">
                        Customer Email:
                      </h3>
                      <h1 className="max-[600px]: text-[.97rem]">
                        {customer?.email || "No email"}
                      </h1>
                    </div>
                    {/* Table no. */}
                    <div className="mt-2 max-[350px]:mt-0">
                      <h3 className="text-[11px] text-gray-500">Table No:</h3>
                      <h1 className="max-[600px]: text-[.97rem]">
                        {latestOrder.tableNumber || "N/A"}
                      </h1>
                    </div>
                    {/* Order count and total */}
                    <div className="mt-2 max-[350px]:mt-0">
                      <h3 className="text-[11px] text-gray-500">
                        Order Info:
                      </h3>
                      <h1 className="max-[600px]: text-[.97rem]">
                        {group.orderCount} items • ₹{group.totalAmount}
                      </h1>
                    </div>
                  </section>

                  <AccordionTrigger className="max-[800px]:hidden"></AccordionTrigger>
                </main>
                <AccordionContent className="p-5 border-t">
                  <div className="space-y-3">
                    {group.orders.map((order) => (
                      <CustomerOrdered
                        key={order.id}
                        order={order}
                        functionToRefetchOrders={refreshOrders}
                      />
                    ))}
                  </div>
                </AccordionContent>
                <AccordionTrigger className="mx-auto p-0 min-[800px]:hidden my-2"></AccordionTrigger>
              </AccordionItem>
            </Accordion>
          );
        })
      )}
    </div>
  );
}
