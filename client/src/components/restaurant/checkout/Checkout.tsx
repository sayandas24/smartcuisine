"use client";
import {
  Form, 
} from "@/components/ui/form";
import { checkoutSchema } from "@/schemas/checkoutSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { usePathname, useRouter } from "next/navigation";
import { useItemStore } from "@/store/orderStore";
import CheckoutSidebar from "./CheckoutSIdebar";
import axios from "axios"; 
import PaymentButtons from "./PaymentButtons";
import AddressArea from "./AddressArea";
import CheckoutFormFields from "./CheckoutFormFields"; 
import EmptyCheckout from "./EmptyCheckout";
import { toast } from "sonner";

export default function Checkout() { 
  const showCartItems = useItemStore((state) => state.items);
  const selectedItems = useItemStore((state) => state.selectedItems);
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const form = useForm<z.infer<typeof checkoutSchema>>({
    // takes the schema with actual details
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      mobileNumber: "",
      email: "",
      note: "",
      paymentMethod: "cashOnDelivery",
    },
  });

  const { totalPrice, totalDiscount, filteredCartItems } = useMemo(() => {
    const filteredCartItems = showCartItems.filter((item) =>
      selectedItems.includes(item.id)
    );
    const totalPrice = filteredCartItems.reduce(
      (acc, item) => acc + item.price * item.quantity!,
      0
    );
    const totalDiscount = filteredCartItems.reduce(
      (acc, item) => acc + item.discount!,
      0
    );
    return { totalPrice, totalDiscount, filteredCartItems };
  }, [showCartItems, selectedItems]);

  const totalTime = useMemo(() => {
    const filteredCartItems = showCartItems.filter((item) =>
      selectedItems.includes(item.id)
    );
    const totalTime = filteredCartItems.reduce(
      (acc, item) => acc + item.preparationTime!,
      0
    );
    return totalTime;
  }, [showCartItems, selectedItems]);

  const handleSubmit = async (values: any) => {
    if (values) {
      setIsLoading(true);
      await axios
        .post("/api/restaurant/checkout", {
          items: filteredCartItems,
          totalPrice: totalPrice,
          customerDetails: values,
        })
        .then((res) => {
          toast.success("Order placed successfully");
          //  removing the selected items from the cart
          useItemStore.setState({
            items: showCartItems.filter(
              (item) => !selectedItems.includes(item.id)
            ),
            selectedItems: [],
          });
          router.push("/order-placed");
          setIsLoading(false);
        })
        .catch((err) => {
          toast.error("Failed to place order, please try again");
          setIsLoading(false);
          console.log(err);
        });
      if (pathname === "/order-placed") {
        setIsLoading(false);
      }
    }
  };

  return (
    <Form {...form}>
      {filteredCartItems.length === 0 ? (
        <EmptyCheckout />
      ) : (
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="p-5 space-y-6 mx-auto flex gap-10 max-[1550px]:flex-col relative"
        >
          <section className="space-y-8 w-[50rem] max-[1000px]:w-full">
            <div>
              <h1 className="text-lg font-semibold ml-0">
                Complete Your Order
              </h1>
              <p className="text-gray-600 mt-1 text-sm">
                Please fill in your details to finalize your delicious meal
                order
              </p>
            </div>
            <CheckoutFormFields form={form} />
            <div className="flex gap-4 max-[700px]:flex-col">
              <AddressArea />
              <PaymentButtons form={form} />
            </div>
          </section>
          <CheckoutSidebar
            totalPrice={totalPrice}
            selectedItems={filteredCartItems}
            isLoading={isLoading}
            totalDiscount={totalDiscount}
            totalTime={totalTime}
          />
        </form>
      )}
    </Form>
  );
}
