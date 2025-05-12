"use client";
import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckCircle, XCircle, User, Leaf } from "lucide-react";
import PendingOrderItems from "./PendingOrderItems";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";
import UseFetchOrders from "@/hooks/UseFetchOrders";

export default function PendingOrders() {
  const { data: session } = useSession();
  const accessToken = session?.user?.accessToken;
  const { 
    pendingOrders,
    groupedOrders,
    allGroupedOrders,
    status,
    refreshOrders,
  } = UseFetchOrders(accessToken);

  // State to toggle between showing only pending orders or all orders
  const [showOnlyPending, setShowOnlyPending] = useState<boolean>(true);
  console.log("PendingOrders", pendingOrders)

  // The orders to display based on the toggle
  const ordersToDisplay = showOnlyPending ? groupedOrders : allGroupedOrders;
  
  // Handle acceptance or rejection of orders
  const handleOrderAction = async (
    groupId: string | number,
    action: "accept" | "reject"
  ) => {
    if (!accessToken) {
      toast.error("Authentication required to perform this action");
      return;
    }

    try {
      const newStatus = action === "accept" ? "processing" : "cancelled";

      // Find the group to update - first try current display orders, then try all grouped orders
      const group = ordersToDisplay.find(
        (g) =>
          g.customer_id === String(groupId) &&
          Math.abs(g.timestamp! - Date.now()) < 24 * 60 * 60 * 1000
      ); // Within 24 hours

      if (!group) {
        toast.error("Order group not found");
        return;
      }
      // Process all orders in this time-specific group
      for (const order of group.orders) {
        console.log(`Updating order ${order.id} to status ${newStatus}`);
        await axiosInstance.patch(
          `/admin/orders`,
          { id: order.id, order_status: newStatus, payment_status: "pending" },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      }

      toast.success(
        `Order${group.orders.length > 1 ? "s" : ""} ${action === "accept" ? "accepted" : "rejected"} successfully`
      );

      // Refresh orders after action
      refreshOrders();
    } catch (error) {
      console.error(`Error ${action}ing order(s):`, error);
      toast.error(`Failed to ${action} order(s). Please try again.`);
    }
  };

  // If no orders or not authenticated yet
  if (!accessToken) {
    return (
      <div className="my-10 text-center">
        <p>Please sign in to view pending orders</p>
      </div>
    );
  }

  if (status && !allGroupedOrders) {
    return (
      <div className="my-10 text-center">
        <p>{status}</p>
      </div>
    );
  }

  return (
    <div className="my-10">
      {!ordersToDisplay || ordersToDisplay.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg max-w-[60rem] mx-auto">
          <p className="text-gray-500">
            {showOnlyPending
              ? "No pending orders available"
              : "No orders available"}
          </p>
        </div>
      ) : (
        ordersToDisplay.map((group, index) => (
          <Accordion
            key={`${group.customer_id}_${group.timestamp}_${index}`}
            type="single"
            collapsible
            className="max-w-[60rem] mx-auto mt-5"
          >
            <section className="flex justify-between w-full">
              <div className="text-xs text-gray-700 ml-2 mb-1 max-[600px]:hidden">
                {group.orders[0]?.tableNumber
                  ? `Table No: ${group.orders[0].tableNumber}`
                  : "Online Order"}
              </div>
              <div className="text-[.8rem] flex items-center gap-2 mr-2">
                <h3 className="text-[11px] text-gray-500">
                  Ordered Time (IST):
                </h3>
                <h1 className="">{group.latestOrderTime}</h1>
              </div>
            </section>
            <AccordionItem
              value="item-1"
              className={`rounded-xl border ${
                showOnlyPending
                  ? "border-green-500"
                  : group.orders[0]?.order_status.toLowerCase() === "pending"
                    ? "border-green-500"
                    : group.orders[0]?.order_status.toLowerCase() ===
                        "processing"
                      ? "border-blue-500"
                      : group.orders[0]?.order_status.toLowerCase() ===
                          "completed"
                        ? "border-purple-500"
                        : "border-gray-300"
              } shadow-sm`}
            >
              <main className="flex gap-5 max-[600px]:gap-2 justify-between rounded-xl p-2 ">
                <section className="flex gap-5 max-[600px]:gap-2 w-full justify-between">
                  {/* Customer avatar */}
                  <div className="flex gap-5 items-center">
                    <div className="rounded-xl overflow-hidden h-[3rem] w-[3rem] border shrink-0 bg-gray-100 flex items-center justify-center">
                      {group.customer?.profile_pic ? (
                        <Image
                          src={group.customer.profile_pic}
                          alt={group.customer?.name || "Customer"}
                          width={48}
                          height={48}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <User className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    {/* Customer name */}
                    <div className="mt-0">
                      <h3 className="text-[11px] text-gray-500">
                        Customer Name:
                      </h3>
                      <h1 className="max-[600px]: text-[.97rem]">
                        {group.customer?.name || "No Name Found"}
                      </h1>
                      {group.customer?.email && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {group.customer.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Order summary and food info */}
                  <div className="ml-2">
                    <h3 className="text-[11px] text-gray-500">Orders:</h3>
                    <div className="flex items-center">
                      <h1 className="max-[600px]: text-[.97rem]">
                        {group.orderCount} items • ₹{group.totalAmount}
                      </h1>

                      {/* Show veg indicator if all items are veg */}
                      {group.orders.every(
                        (order) => order.foodDetails?.is_veg === 1
                      ) && (
                        <span className="ml-1 p-1 rounded-full bg-green-50">
                          <Leaf size={12} className="text-green-500" />
                        </span>
                      )}
                    </div>

                    {/* Show status badge */}
                    <div className="mt-1 flex items-center gap-1">
                      <span
                        className={`text-xs rounded-full px-2 py-0.5 ${
                          group.orders[0]?.order_status.toLowerCase() ===
                          "pending"
                            ? "bg-green-100 text-green-700"
                            : group.orders[0]?.order_status.toLowerCase() ===
                                "processing"
                              ? "bg-blue-100 text-blue-700"
                              : group.orders[0]?.order_status.toLowerCase() ===
                                  "completed"
                                ? "bg-purple-100 text-purple-700"
                                : group.orders[0]?.order_status.toLowerCase() ===
                                    "cancelled"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {group.orders[0]?.order_status}
                      </span>
                    </div>

                    {/* Show first food item image if available */}
                    {group.orders[0]?.foodDetails?.img && (
                      <div className="mt-1 flex items-center gap-1">
                        <div className="w-4 h-4 rounded-full overflow-hidden">
                          <Image
                            src={group.orders[0].foodDetails.img}
                            alt={group.orders[0].foodDetails.name}
                            width={16}
                            height={16}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <span className="text-xs text-gray-500 truncate max-w-[120px]">
                          {group.orders[0].foodDetails.name}
                          {group.orderCount > 1 &&
                            ` +${group.orderCount - 1} more`}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action buttons - only show for pending orders */}
                  {group.orders[0]?.order_status.toLowerCase() ===
                    "pending" && (
                    <div className="flex space-x-3 items-center">
                      <button
                        onClick={() =>
                          handleOrderAction(group.customer_id, "accept")
                        }
                        className="px-4 py-1.5 bg-green-500 text-white rounded-md text-sm font-medium hover:bg-green-600 transition-colors flex items-center space-x-1.5 shadow-md hover:shadow-lg"
                      >
                        <CheckCircle size={16} />
                        <span>Accept Order</span>
                      </button>
                      <button
                        onClick={() =>
                          handleOrderAction(group.customer_id, "reject")
                        }
                        className="px-4 py-1.5 bg-red-500 text-white rounded-md text-sm font-medium hover:bg-red-600 transition-colors flex items-center space-x-1.5 shadow-md hover:shadow-lg"
                      >
                        <XCircle size={16} />
                        <span>Reject Order</span>
                      </button>
                    </div>
                  )}
                </section>

                <AccordionTrigger className="p-5"></AccordionTrigger>
              </main>
              <AccordionContent className="p-5 border-t">
                <div>
                  <PendingOrderItems orderItems={group.orders} />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))
      )}
    </div>
  );
}
