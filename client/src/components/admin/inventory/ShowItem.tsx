"use client";
import axiosInstance from "@/lib/axios";
import {
  Pen,
  Package,
  AlertCircle,
  Check,
  AlertTriangle,
  Clock,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import EditItem from "./EditItem";
import Image from "next/image";
import { useInventoryItems } from "@/hooks/useInventoryItems";

export default function ShowItem({ categoryId }: { categoryId: string }) {
  const { items, loading, error, refetch } = useInventoryItems(categoryId);

  const statusOptions = [
    {
      value: "available",
      label: "Available",
      icon: <Check className="h-4 w-4" />,
      color: "text-green-600",
    },
    {
      value: "out_of_stock",
      label: "Out of Stock",
      icon: <AlertTriangle className="h-4 w-4" />,
      color: "text-red-600",
    },
    {
      value: "low_stock",
      label: "Low Stock",
      icon: <AlertTriangle className="h-4 w-4" />,
      color: "text-yellow-600",
    },
  ];

  return (
    <div className="w-full">
      {loading && (
        <div className="flex justify-center items-center h-40 w-full">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-btnColor"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center gap-3 w-full">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-6 text-center w-full">
          <Package className="h-10 w-10 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">
            No inventory items found in this category
          </p>
        </div>
      )}

      {items.length > 0 && (
        <div className="w-full space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="border-b p-3 flex border-gray-200 bg-white rounded-md shadow-sm hover:shadow-md overflow-hidden w-full gap-2"
            >
              {/* mark image */}
              <section className="w-[4rem] h-[4rem] rounded-lg overflow-hidden border shrink-0 mt-3">
                <Image
                  src={item.img}
                  alt={item.name}
                  width={100}
                  height={100}
                  className="object-cover w-full h-full"
                />
              </section>

              {/* mark item name, desc, discount, price, status */}
              <section className="flex flex-col  rounded-md w-full px-2">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-md">{item.name}</h3>
                  <div
                    className={`flex items-center justify-center  text-gray-600 mt-1 bg-orange-50 py-1 px-3 rounded-xl w-fit text-[.6rem] text-nowrap`}
                  >
                    <Clock className="w-3 h-3 mr-2 text-orange-500" />
                    Estimate Time: {item.preparation_time} min
                  </div>
                </div>

                <p className="text-gray-600 text-xs max-w-[60%] line-clamp-2">
                  {item.description}
                </p>

                <div className="flex justify-between mt-2">
                  <div className="flex items-center gap-2 mt-2">
                    <p className="text-sm font-semibold ">₹{item.cost_price}</p>
                    {item.discount > 0 && (
                      <h1
                        className={`border rounded-md p-2 py-0 bg-green-200 border-green-500 text-green-600 text-xs`}
                      >
                        {item.discount}% OFF
                      </h1>
                    )}
                  </div>
                  <p
                    className={`text-sm font-semibold mt-2 flex items-center gap-1 ${
                      statusOptions.find(
                        (option) => option.value === item.status
                      )?.color
                    }`}
                  >
                    {
                      statusOptions.find(
                        (option) => option.value === item.status
                      )?.icon
                    }
                    {
                      statusOptions.find(
                        (option) => option.value === item.status
                      )?.label
                    }
                  </p>
                </div>
              </section>

              {/* mark edit button */}
              <div className="flex justify-end mt-2 ml-2">
                <EditItem category={item} onSuccess={refetch} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
