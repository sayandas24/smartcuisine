import { Clock, CookingPot, Drumstick, Leaf } from "lucide-react";
import React from "react";
import Image from "next/image";   
import { Order } from "@/types/Order";
 

interface PendingOrderItemsProps {
  orderItems?: Order[];
}

export default function PendingOrderItems({
  orderItems = [],
}: PendingOrderItemsProps) {
  if (!orderItems || orderItems.length === 0) {
    return (
      <div className="p-3 text-center text-gray-500">
        No items in this order
      </div>
    );
  }

  return (
    <div>
      {orderItems.map((order, index) => {
        const foodDetails = order.foodDetails;
        return (
          <div
            key={order.id || index}
            className="border-b p-3 flex border-gray-200 bg-white rounded-md shadow-xs w-full gap-2 items-center justify-between mb-2"
          >
            {/* Food image */}
            <section className="flex gap-2 items-center">
              <div className="w-[2.5rem] h-[2.5rem] rounded-lg overflow-hidden border shrink-0 mt-0 bg-gray-100">
                {foodDetails?.img ? (
                  <Image
                    src={foodDetails.img}
                    alt={foodDetails.name}
                    width={100}
                    height={100}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    No Img
                  </div>
                )}
              </div>
              {/* mark Item name and veg/non-veg indicator */}
              <section className="text-nowrap w-[13rem]">
                <div className="flex items-center">
                  <h3 className="text-[.7rem] text-gray-500">Item Name:</h3>
                  {foodDetails && foodDetails.is_veg === 1 ? (
                    <span className="ml-1 text-green-500">
                      <Leaf size={12} className="inline" />
                    </span>
                  ) : (
                    <span className="ml-1 text-red-500">
                      <Drumstick size={12} className="inline" />
                    </span>
                  )}
                </div>
                <h1 className="text-[.9rem] font-medium">
                  {foodDetails?.name || order.item_id}
                </h1>
                {foodDetails && foodDetails.description && (
                  <p className="text-[.65rem] text-gray-500 max-w-[12rem] truncate">
                    {foodDetails.description}
                  </p>
                )}
              </section>
            </section>

            {/* mark Item details */}
            <div className="max-[350px]:mt-0 w-[9rem]">
              <h3 className="text-[.7rem] text-gray-500">Price:</h3>
              <h1 className="text-[.8rem]">
                ₹{order.total_amount / order.quantity}
              </h1>
              {foodDetails && foodDetails.discount > 0 && (
                <p className="text-[.65rem] text-green-600">
                  Discount: {foodDetails.discount}%
                </p>
              )}
            </div>

            <div className="max-[350px]:mt-0">
              <h3 className="text-[.7rem] text-gray-500">Quantity:</h3>
              <h1 className="text-[.8rem] ml-2">x{order.quantity}</h1>
              <p className="text-[.65rem] text-gray-500">
                Status:{" "}
                <span
                  className={
                    foodDetails && foodDetails.status === "available"
                      ? "text-green-600"
                      : "text-orange-500"
                  }
                >
                  {foodDetails?.status || "unknown"}
                </span>
              </p>
            </div>

            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center justify-center text-gray-600 bg-orange-50 py-1 px-3 rounded-xl w-fit text-[.6rem] text-nowrap">
                <Clock className="w-3 h-3 mr-2 text-orange-500" />
                Prep time: {foodDetails?.preparation_time || "10"} min
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
