import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import {
  BadgeDollarSign,
  Check,
  ShoppingCart,
  Clock,
  Loader2,
} from "lucide-react";
import { useNavVisibility } from "@/utils/scrollUtils";
import { Shop } from "@mui/icons-material";

export default function CheckoutSidebar({
  totalPrice,
  selectedItems,
  isLoading,
  totalDiscount,
  totalTime,
}: any) {
  const isNavVisible = useNavVisibility((state) => state.isNavVisible);
  const [couponError, setCouponError] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);

  // Calculate values (you may need to adjust these based on your business logic)
  const subtotal = totalPrice;
  const discount = (subtotal * totalDiscount) / 100;
  const discountAndTotal = subtotal - discount;

  const gst = 12;
  const gstAmount = (discountAndTotal * gst) / 100;
  const grandTotal = subtotal - discount + gstAmount;
  const totalSavings = discount;

  const cartSidebarUi = [
    {
      sidebarBox:
        "py-7 flex flex-col gap-5 rounded-3xl p-3 border border-[#00000010] w-[24.5rem] shadow-md bg-white backdrop-blur-sm dark:shadow-gray-500 dark:text-black dark:bg-white dark:border-none max-[1000px]:w-full",
      orderTitle:
        "text-2xl font-semibold text-gray-800 flex items-center max-[700px]:text-[1.3rem]",

      orderSummaryBox:
        "bg-gradient-to-r from-orange-500 to-orange-600 text-white p-2 rounded-xl mr-3 shadow-sm",
      paymentInfoTitles:
        "flex justify-between items-center text-base sm:text-lg",
      discountSectionBox:
        "py-5 flex flex-col gap-4 rounded-3xl p-3 border border-[#00000010] w-[24.5rem] shadow-md bg-white backdrop-blur-sm dark:shadow-gray-500 dark:text-black dark:bg-white dark:border-none max-[1000px]:w-full h-fit",
      discountSectionTitle:
        "text-xl font-semibold text-gray-800 flex items-center",
      deliveryTimeBox:
        "flex items-center justify-center text-sm text-gray-600 mt-1 bg-orange-50 py-2 px-3 rounded-xl",
      inputBox:
        "pr-20 py-6 rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500 dark:border-[#00000027] shadow-sm",
      applyButton:
        "absolute right-3 top-2.5 rounded-lg bg-orange-50 px-4 py-1.5 font-medium text-orange-600 text-sm hover:bg-orange-100 transition-colors",
      checkoutButton:
        "max-[700px]:w-[90%] w-full rounded-xl py-7 text-lg font-semibold bg-[#DC7F02] text-white  hover:bg-[#e08a1ae0] max-[700px]:hover:bg-[#DC7F02] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center max-[700px]:fixed bottom-2 left-1/2 z-50 max-[700px]:-translate-x-1/2",
    },
  ];

  const handleCoupon = () => {
    setCouponLoading(true);
    setTimeout(() => {
      setCouponLoading(false);
      setCouponError(true);
    }, 2000);
  };

  return (
    <main className="space-y-4 sticky top-[4rem] h-full">
      <div className="flex min-[1550px]:flex-col gap-4   max-[1000px]:flex-col relative">
        <section className={cartSidebarUi[0].sidebarBox}>
          <h1 className={cartSidebarUi[0].orderTitle}>
            <span className={cartSidebarUi[0].orderSummaryBox}>
              <ShoppingCart className="w-5 h-5" />
            </span>
            Order Summary
          </h1>

          <div className="flex flex-col gap-4 bg-gray-50 p-3 rounded-2xl">
            {selectedItems.map((item: any) => (
              <section
                key={item.id}
                className={cartSidebarUi[0].paymentInfoTitles}
              >
                <h1 className="text-gray-600">
                  {item.name}{" "}
                  <span className="text-gray-400 text-xs">
                    ({item.quantity}x)
                  </span>
                </h1>
                <h1 className="font-normal">₹{item.price * item.quantity}</h1>
              </section>
            ))}
            <hr className="border-gray-200 dark:border-[#00000027]" />
            <section className={cartSidebarUi[0].paymentInfoTitles}>
              <h1 className="flex items-center text-green-600">
                <Check className="w-4 h-4 mr-2" />
                Discount
              </h1>
              <h1 className="font-medium text-green-600">- ₹{discount.toFixed(0)}</h1>
            </section>

            <section className={cartSidebarUi[0].paymentInfoTitles}>
              <h1 className="text-gray-600">GST</h1>
              <h1 className="font-medium">
                <span className="text-sm">+</span>
                {gst}%
              </h1>
            </section>

            <hr className="border-gray-200 dark:border-[#00000027]" />
            <section className={cartSidebarUi[0].paymentInfoTitles}>
              <h1 className="font-semibold text-gray-800">Amount to pay</h1>
              <h1 className="font-bold text-gray-800">
                ₹{grandTotal.toFixed(0)}
              </h1>
            </section>
          </div>

          {/*mark Savings banner with realistic wavy border and color to match image */}
          {discount > 0 && (
            <div className="mt-1 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-md">
                <div className="p-[14px_16px_16px] bg-[#DC7F02] min-[700px]:py-[20px]">
                  <div className="font-medium text-white flex items-center">
                    <BadgeDollarSign className="w-5 h-5 mr-2" />
                    Your total Savings
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs sm:text-sm text-white/80">
                      Includes ₹{totalSavings.toFixed(0)} savings discount
                    </span>
                    <span className="font-bold text-lg text-white">
                      ₹{totalSavings.toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/*mark Estimated delivery time with icon */}
          {totalTime > 0 && (
            <div className={cartSidebarUi[0].deliveryTimeBox}>
              <Clock className="w-4 h-4 mr-2 text-orange-500" />
              Estimated Delivery Time: {totalTime} minutes
            </div>
          )}
        </section>

        {/*mark discount section with enhanced design */}
        <section className={cartSidebarUi[0].discountSectionBox}>
          <h1 className={cartSidebarUi[0].discountSectionTitle}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="w-5 h-5 text-orange-500 mr-1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185Z"
              />
            </svg>
            Have a Coupon?
          </h1>

          <div>
            <div className="relative">
              <Input
                type="text"
                placeholder="Enter Coupon Code"
                className={cartSidebarUi[0].inputBox}
              />
              <button
                onClick={handleCoupon}
                type="button"
                className={cartSidebarUi[0].applyButton}
                disabled={couponLoading}
              >
                {couponLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Apply"
                )}
              </button>
            </div>
            {couponError && (
              <div className="flex items-center justify-center text-sm text-red-600 mt-1 py-2 px-3 rounded-xl">
                <span className="text-xs">Wrong Coupon Code</span>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Checkout button - enhanced and fixed at bottom on mobile */}
      {/* <div className="mt-6 sm:mt-8 w-[22rem] max-[1000px]:w-full relative"> */}
      <Button
        className={`${cartSidebarUi[0].checkoutButton} ${isNavVisible ? "bottom-16" : "bottom-2"} transition-all duration-300 ${isLoading ? "!bg-[#e08a1ae0] cursor-not-allowed pointer-events-none" : ""}`}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
        ) : (
          <Shop className="w-5 h-5 mr-2" />
        )}
        {isLoading ? "Processing..." : "Place Order"}
      </Button>
      {/* </div> */}

      {/* Space at the bottom on mobile to account for fixed button */}
      <div className="h-20 min-[700px]:h-0 max-[700px]:block hidden"></div>
    </main>
  );
}
