import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tabs } from "@/components/ui/tabs";
import React from "react";
import Orders from "./Orders";
import orderInfoData from "@/data/orderInfoData";

export default function OrdersCategoryHeader() {
  return (
    <Tabs defaultValue="all" className="w-full">
      <div className="flex justify-center">
        <TabsList className="my-2 rounded-full">
          <TabsTrigger value="all" className="rounded-full">
            All
          </TabsTrigger>
          <TabsTrigger value="pending" className="rounded-full">
            Pending
          </TabsTrigger>
          <TabsTrigger value="processing" className="rounded-full">
            Processing
          </TabsTrigger>
          <TabsTrigger value="completed" className="rounded-full">
            Completed
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="rounded-full">
            Cancelled
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="all">
        <Orders orders={orderInfoData} />
      </TabsContent>

      <TabsContent value="pending">
        <Orders
          orders={orderInfoData.filter(
            (order) => order.status === "Pending"
          )}
        />
      </TabsContent>

      <TabsContent value="processing">
        <Orders
          orders={orderInfoData.filter((order) => order.status === "Processing")}
        />
      </TabsContent>

      <TabsContent value="completed">
        <Orders
          orders={orderInfoData.filter((order) => order.status === "Completed")}
        />
      </TabsContent>

      <TabsContent value="cancelled">
        <Orders
          orders={orderInfoData.filter((order) => order.status === "Cancelled")}
        />
      </TabsContent>
    </Tabs>
  );
}
