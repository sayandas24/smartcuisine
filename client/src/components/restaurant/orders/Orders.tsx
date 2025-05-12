"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React from "react";
import CustomizedSteppers from "./OrderStepper";
import orderInfoData from "@/data/orderInfoData";
import Image from "next/image";

interface OrdersProps {
  orders?: typeof orderInfoData;
}

export default function Orders({ orders = orderInfoData }: OrdersProps) {
  return (
    <div className="flex flex-col gap-5">
      {orders.map((order) => (
        <Accordion key={order.title} type="single" collapsible className="">
          <div className="text-xs text-gray-700 ml-2 mb-1 max-[600px]:hidden">
            Order ID: {order.orderId}
          </div>
          <AccordionItem value="item-1" className="rounded-xl border shadow-sm">
            <main className="flex gap-5 max-[600px]:gap-2 justify-between rounded-xl p-2">
              <section className="flex gap-5 max-[600px]:gap-2">
                <div className="rounded-xl overflow-hidden h-[5rem] w-[5rem] border shrink-0 max-[350px]:w-[4rem] max-[350px]:h-[4rem]">
                  <Image
                    src={order.image}
                    alt={order.title}
                    width={100}
                    height={100}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="mt-2 max-[350px]:mt-0">
                  <h1 className="max-[600px]:text-[.9rem]">{order.title}</h1>
                  <p className="text-xs text-gray-500">
                    Quantity: X{order.quantity}
                  </p>
                  <h1 className="text-sm min-[800px]:hidden mt-2">
                    ₹{order.price * order.quantity}
                  </h1>
                </div>
              </section>

              <section className="flex gap-10 pt-2 max-[600px]:gap-2 max-[350px]:pt-0">
                <div className="max-[800px]:hidden borderd min-[800px]:w-[6rem]">
                  <h1 className="">₹{order.price * order.quantity}</h1>
                  <p className="text-xs text-gray-500">
                    Method: {order.method}
                  </p>
                </div>

                <div className="borderd min-[800px]:w-[13rem]">
                  <div className="flex gap-1 items-center">
                    <span
                      style={{ backgroundColor: order.statusColor }}
                      className={`flex w-2 h-2 rounded-full`}
                    ></span>
                    <h1 className="max-[600px]:text-[.9rem]">{order.status}</h1>
                  </div>
                  <p className="text-xs text-gray-500 ml-3 max-[600px]:text-[0.6rem]">
                    {order.statusDescription}
                  </p>
                  <div className="text-xs max-[600px]:text-[.6rem] text-gray-700 ml-3 mt-2 min-[800px]:hidden font-[500]">
                    Order ID: {order.orderId}
                  </div>
                </div>
                <AccordionTrigger className="max-[800px]:hidden"></AccordionTrigger>
              </section>
            </main>
            <AccordionContent className="p-5 border-t">
              <div>
                <CustomizedSteppers activeStep={order.statusNumber} />
              </div>
            </AccordionContent>
            <AccordionTrigger className="mx-auto p-0 min-[800px]:hidden my-2"></AccordionTrigger>
          </AccordionItem>
        </Accordion>
      ))}
    </div>
  );
}
