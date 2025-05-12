"use client";
import { useItemStore } from "@/store/orderStore";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";

import { Card } from "@/components/ui/card";
import { BorderBeam } from "@/components/magicui/border-beam";
import { Check } from "lucide-react";

export default function BottomCart({ className }: { className: string }) {
  const showCartItems = useItemStore((state) => state.items);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const prevItemCountRef = useRef(showCartItems.length);

  useEffect(() => {
    // Only animate if items have been added (not removed or initialized)
    const currentCount = showCartItems.length;
    const previousCount = prevItemCountRef.current;

    if (currentCount > previousCount) {
      setShouldAnimate(true);

      // Reset animation state after animation completes
      const timer = setTimeout(() => {
        setShouldAnimate(false);
      }, 1000);

      // Cleanup function
      return () => clearTimeout(timer);
    }

    // Always update the reference for next comparison
    prevItemCountRef.current = currentCount;
  }, [showCartItems.length]);

  const UI = [
    {
      cardStructure:
        "dark:bg-[#313131] bg-[#ffffff] shadow-md fixed bottom-3 left-1/2 -translate-x-1/2 border rounded-xl  p-4 py-2 flex items-center gap-2 flex-nowrap w-[25rem]",
    },
  ];

  return (
    <Card className={`${UI[0].cardStructure} ${className} max-[450px]:w-[95%]`}>
      <section className="overflow-hidden rounded-full w-10 h-10 border shrink-0">
        {showCartItems.length > 0 && (
          <Image
            src={showCartItems[showCartItems.length - 1].image || ""}
            alt="logo"
            className="object-cover h-full w-full"
            width={100}
            height={100}
          />
        )}
      </section>

      <section className="shrink-0 flex flex-col max-[450px]:text-sm">
        <div className="h-6 overflow-hidden">
          <h1
            key={showCartItems[showCartItems.length - 1]?.id || Date.now()}
            className={`text-ellipsis whitespace-nowrap duration-1000 ${shouldAnimate ? "animate-slide-up" : ""}`}
          >
            {showCartItems[showCartItems.length - 1].name}
          </h1>
        </div>
        <p className="flex items-center gap-2">
          Item Added{" "}
          <Check
            key={
              shouldAnimate
                ? showCartItems[showCartItems.length - 1]?.id || Date.now()
                : "static-check"
            }
            className={`w-4 h-4 text-green-500 duration-300 text-ellipsis whitespace-nowrap ${shouldAnimate ? "animate-zoom-in" : "animate-zoom-out duration-1000"} `}
          />
        </p>
      </section>

      <Link href="/cart" className="shrink-0 block ml-auto">
        <div className="rounded-xl bg-[#ea580c] px-4 py-1 text-white flex flex-col items-center">
          <span className="text-sm">View Cart</span>
          <span className="text-xs text-[#ffc6a7] leading-1">
            <span
              key={showCartItems[showCartItems.length - 1]?.id || Date.now()}
              className={`animate-slide-up duration-300`}
            >
              {showCartItems.length}
            </span>{" "}
            {showCartItems.length > 1 ? "items" : "item"}
          </span>
        </div>
      </Link>
      <BorderBeam duration={8} size={100} />
    </Card>
  );
}
