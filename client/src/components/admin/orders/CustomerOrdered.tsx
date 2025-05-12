import {
  Clock,
  CookingPot,
  Edit,
  Leaf,
  Drumstick,
  CheckCircle2,
  XCircle,
  User,
} from "lucide-react";
import React, { useState } from "react";
import OrderedItemEdit from "./OrderedItemEdit";
import { Dialog } from "@/components/ui/dialog"; 
import Image from "next/image";  
import { Order } from "@/types/Order";

interface CustomerOrderedProps {
  order: Order;
  functionToRefetchOrders: () => void;
}

export default function CustomerOrdered({ order, functionToRefetchOrders }: CustomerOrderedProps) {
  const [isOpen, setIsOpen] = useState(false);
  const foodDetails = order.foodDetails;

  const handleDialogClose = (open: boolean) => {
    setIsOpen(open);
  };

  // Helper function to get status icon and color
  const getStatusDisplay = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "processing":
        return {
          icon: <CookingPot className="w-3 h-3 text-orange-500" />,
          text: "Processing",
          color: "text-orange-600",
        };
      case "completed":
        return {
          icon: <CheckCircle2 className="w-3 h-3 text-green-500" />,
          text: "Completed",
          color: "text-green-600",
        };
      case "cancelled":
        return {
          icon: <XCircle className="w-3 h-3 text-red-500" />,
          text: "Canceled",
          color: "text-red-600",
        };
      default:
        return {
          icon: <CookingPot className="w-3 h-3 text-gray-500" />,
          text: status || "Unknown",
          color: "text-gray-600",
        };
    }
  };

  const { icon, text, color } = getStatusDisplay(order.order_status);

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <div className="border-b p-3 flex border-gray-200 bg-white rounded-md shadow-sm hover:shadow-md w-full gap-2 items-center justify-between">
        {/* Food image */}
        <section className="flex gap-2 items-center">
          <div className="w-[3rem] h-[3rem] rounded-lg overflow-hidden border shrink-0 mt-0 bg-gray-100 flex items-center justify-center">
            {foodDetails?.img ? (
              <Image
                src={foodDetails.img}
                alt={foodDetails.name}
                width={100}
                height={100}
                className="object-cover w-full h-full"
              />
            ) : (
              <User className="w-6 h-6 text-gray-400" />
            )}
          </div>
          <div className="text-nowrap w-[8rem]">
            <div className="flex items-center">
              <h3 className="text-[11px] text-gray-500">Item Name:</h3>
              {foodDetails &&
                (foodDetails.is_veg === 1 ? (
                  <span className="ml-1 text-green-500">
                    <Leaf size={12} className="inline" />
                  </span>
                ) : (
                  <span className="ml-1 text-red-500">
                    <Drumstick size={12} className="inline" />
                  </span>
                ))}
            </div>
            <h1 className="text-[1rem] font-medium w-[10rem] overflow-hidden text-ellipsis">
              {foodDetails?.name || `Item #${order.item_id}`}
            </h1>
            {foodDetails && foodDetails.description && (
              <p className="text-[11px] text-gray-500 max-w-[12rem] truncate">
                {foodDetails.description}
              </p>
            )}
          </div>
        </section>

        {/* Price info */}
        <div className="mt-0 w-[5rem] ">
          <h3 className="text-[11px] text-gray-500">Price:</h3>
          <h1 className="max-[600px]: text-[.97rem]">
            ₹{order.total_amount / order.quantity}
          </h1>
          {foodDetails && foodDetails.discount > 0 && (
            <p className="text-[11px] text-green-600">
              Discount: {foodDetails.discount}%
            </p>
          )}
        </div>

        {/* Quantity */}
        <div className="mt-0">
          <h3 className="text-[11px] text-gray-500">Quantity:</h3>
          <h1 className="max-[600px]: text-[.97rem] ml-2">x{order.quantity}</h1>
        </div>

        {/* Preparation time */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center justify-center text-gray-600 bg-orange-50 py-1 px-3 rounded-xl w-fit text-[.6rem] text-nowrap">
            <Clock className="w-3 h-3 mr-2 text-orange-500" />
            Prep time: {foodDetails?.preparation_time || "10"} min
          </div>
        </div>

        {/* Item status */}
        <div className="mt-0">
          <h3 className="text-[11px] text-gray-500 ml-2">Item Status:</h3>
          <h1
            className={`max-[600px]: text-[.8rem] ${color} flex items-center gap-2`}
          >
            {icon}
            <span>{text}</span>
          </h1>
        </div>

        {/* Edit button - only show for processing orders */} 
        <div
          className="flex justify-end mt-2 ml-2 cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <span className="flex items-center gap-2 border border-btnColor text-btnColor hover:text-btnColor hover:bg-[#c771003a] font-medium transition-all px-2 !py-1 rounded-xl text-xs cursor-pointer">
            <Edit className="w-5 h-5 text-btnColor" />
            Change Status
          </span>
        </div> 
      </div>
      {isOpen && (
        <OrderedItemEdit
          state={order.order_status}
          setIsOpen={setIsOpen}
          orderId={order.id}
          functionToRefetchOrders={functionToRefetchOrders}
        />
      )}
    </Dialog>
  );
}
