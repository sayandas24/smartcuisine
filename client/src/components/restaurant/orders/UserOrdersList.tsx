"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React from "react";
import CustomizedSteppers from "./OrderStepper"; 
import Image from "next/image";
import {
  CookingPot,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Leaf,
  Drumstick,
} from "lucide-react";  
import { Order } from "@/types/Order";

interface UserOrdersListProps {
  orders: Order[];
}

export default function UserOrdersList({ orders }: UserOrdersListProps) {
  if (orders.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg max-w-[60rem] mx-auto mt-5">
        <p className="text-gray-500">No orders found</p>
      </div>
    );
  }

  // mark Helper function to get status display properties
  const getStatusDisplay = (status: string) => {
    const statusLower = status.toLowerCase();

    switch (statusLower) {
      case "pending":
        return {
          text: "Pending",
          statusNumber: 0,
          statusDescription: "Waiting for restaurant confirmation",
          statusColor: "#FFD700", // Gold
          icon: <Clock className="h-4 w-4" />,
        };
      case "processing":
        return {
          text: "Processing",
          statusNumber: 1,
          statusDescription: "Your order is being prepared",
          statusColor: "#ff921d", // Orange
          icon: <CookingPot className="h-4 w-4" />,
        };
      case "completed":
        return {
          text: "Completed",
          statusNumber: 2,
          statusDescription: "Your order has been delivered",
          statusColor: "#10B981", // Green
          icon: <CheckCircle2 className="h-4 w-4" />,
        };
      case "cancelled":
        return {
          text: "Cancelled",
          statusNumber: 3,
          statusDescription: "Your order has been cancelled",
          statusColor: "#FF0000", // Red
          icon: <XCircle className="h-4 w-4" />,
        };
      default:
        return {
          text: status || "Unknown",
          statusNumber: 0,
          statusDescription: "Status unknown",
          statusColor: "#6B7280", // Gray
          icon: <Clock className="h-4 w-4" />,
        };
    }
  };

  return (
    <div className="flex flex-col gap-5 mt-4">
      {orders.map((order) => {
        const {
          text: statusText,
          statusNumber,
          statusDescription,
          statusColor,
          icon: statusIcon,
        } = getStatusDisplay(order.order_status);

        const foodDetails = order.foodDetails;

        return (
          <Accordion key={order.id} type="single" collapsible className="">
             
            <div className="flex gap-5 items-center justify-between">
              {foodDetails?.preparation_time && (
                <p className="text-xs text-gray-500 ml-2">
                  Prep time: {foodDetails.preparation_time} min
                </p>
              )}
              <p className="text-xs text-gray-500 mr-2">
                Ordered: {order.ordered_on_ist}
              </p>
            </div>

            <AccordionItem
              value="item-1"
              className="rounded-xl border shadow-sm"
            >
              <main className="flex gap-5 max-[600px]:gap-2 justify-between rounded-xl p-2">
                <section className="flex gap-5 max-[600px]:gap-2">
                  <div className="rounded-xl overflow-hidden h-[5rem] w-[5rem] border shrink-0 max-[350px]:w-[4rem] max-[350px]:h-[4rem] bg-gray-100 flex items-center justify-center">
                    {foodDetails?.img ? (
                      <Image
                        src={foodDetails.img}
                        alt={foodDetails.name}
                        width={100}
                        height={100}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <User className="w-10 h-10 text-gray-400" />
                    )}
                  </div>
                  <div className="mt-2 max-[350px]:mt-0">
                    <div className="flex items-center gap-1">
                      <span className="max-[600px]:text-[.9rem]">
                        {foodDetails?.name || `Item #${order.item_id}`} 
                      </span>
                       
                    </div>
                    <p className="text-xs text-gray-500">
                      Quantity: x{order.quantity}
                    </p>

                    <h1 className="text-sm min-[800px]:hidden mt-2">
                      ₹{order.total_amount}
                    </h1>
                  </div>
                </section>

                <section className="flex gap-10 pt-2 max-[600px]:gap-2 max-[350px]:pt-0 max-[400px]:w-[8rem]">
                  <div className="max-[800px]:hidden borderd min-[800px]:w-[6rem]">
                    <h1 className="">₹{order.total_amount}</h1>
                    <p className="text-xs text-gray-500">
                      Payment: {order.payment_status}
                    </p>
                  </div>

                  <div className="borderd min-[800px]:w-[13rem]">
                    <div className="flex gap-1 items-center">
                      <span
                        style={{ backgroundColor: statusColor }}
                        className={`flex w-2 h-2 rounded-full`}
                      ></span>
                      <h1 className="max-[600px]:text-[.9rem] flex items-center gap-1">
                        {statusText}
                        <span className="ml-1">{statusIcon}</span>
                      </h1>
                    </div>
                    <p className="text-xs text-gray-500 ml-3 max-[600px]:text-[0.6rem]">
                      {statusDescription}
                    </p>
                    <div className="text-xs max-[600px]:text-[.6rem] text-gray-700 ml-3 mt-2  font-[500]">
                      Order ID: {order.id}
                    </div>
                  </div>
                  <AccordionTrigger className="max-[800px]:hidden"></AccordionTrigger>
                </section>
              </main>
              <AccordionContent className="p-5 border-t">
                <div>
                  <CustomizedSteppers
                    activeStep={statusNumber}
                    status={order.order_status}
                  />
                </div>
              </AccordionContent>
              <AccordionTrigger className="mx-auto p-0 min-[800px]:hidden my-2"></AccordionTrigger>
            </AccordionItem>
          </Accordion>
        );
      })}
    </div>
  );
}
