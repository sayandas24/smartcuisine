"use client";
import React, { useTransition } from "react";
import { Button } from "../../ui/button";
import {
  AlertTriangle,
  Check,
  Heart,
  Loader2,
  Minus,
  Plus,
  Triangle,
  Vegan,
} from "lucide-react";
import { useItemStore } from "@/store/orderStore";
import HoverInfo from "../../smallComponents/HoverInfo";
import Image from "next/image";

interface FoodItemCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
  discount: number;
  isVeg: boolean;
  status: string;
  preparationTime: number;
}

export default function FoodItemCard({
  id,
  name,
  description,
  price,
  image,
  category,
  quantity,
  discount,
  isVeg,
  status,
  preparationTime,
}: FoodItemCardProps) {
  // zustand store
  const addFoodItem = useItemStore((state) => state.addItem);
  const allItems = useItemStore((state) => state.items);
  const updateItem = useItemStore((state) => state.updateItem);
  const removeItem = useItemStore((state) => state.removeItem);
  const selectedItems = useItemStore((state) => state.selectedItems);
  const updateSelectedItems = useItemStore(
    (state) => state.updateSelectedItems
  );

  const [isPending, startTransition] = useTransition();

  // mark:  pass handleCartClick(id, name, price, quantity)
  const handleCartClick = (
    id: string,
    name: string,
    price: number,
    quantity: number,
    discount: number,
    isVeg: boolean,
    status: string,
    preparationTime: number
  ) => {
    startTransition(() => {
      const itemExists = allItems.find((item) => item.id === id);
      if (!itemExists) {
        // add default check to item when going to the cart
        updateSelectedItems([...selectedItems, id]);

        addFoodItem({
          id,
          name,
          price,
          description,
          image,
          category,
          quantity: 1,
          discount,
          isVeg,
          status,
          preparationTime,
        });
      } else {
        // if item in the cart, then update the quantity
        const currentItem = allItems.find((item) => item.id === id);
        if (currentItem) {
          updateItem(id, {
            ...currentItem,
            quantity: (currentItem.quantity || 0) + 1,
          });
        }
      }
    });
  };

  // mark: pass handleQuantityIncrease(id)
  const handleQuantityIncrease = (id: string) => {
    const itemExists = allItems.find((item) => item.id === id);

    if (!itemExists) {
      addFoodItem({
        id,
        name,
        price,
        description,
        image,
        category,
        quantity: 1,
        discount,
        isVeg,
        status,
      });
    } else {
      updateItem(id, {
        ...itemExists,
        quantity: (itemExists.quantity || 0) + 1,
      });
    }
  };

  // mark: pass handleQuantityDecrease(id)
  const handleQuantityDecrease = (id: string) => {
    const itemExists = allItems.find((item) => item.id === id);
    if (itemExists?.quantity === 1) {
      removeItem([id]);
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    } else if (itemExists?.quantity! > 0) {
      updateItem(id, { ...itemExists!, quantity: itemExists!.quantity! - 1 });
    } else {
      console.log("Item does not exist");
    }
  };

  // ui
  const UI = [
    {
      cardStructure:
        "border overflow-hiddens rounded-xl w-[15rem] h-[25rem] flex flex-col p-1 shadow-md max-[700px]:w-[30rem] max-[700px]:flex-row-reverse max-[700px]:h-[12rem] max-[700px]:border-none max-[700px]:shadow-none max-[700px]:mx-auto max-[500px]:w-[100%] relative",
      imageSection:
        "w-full h-[60%] rounded-xl  relative bg-yellow-600 max-[700px]:w-[10rem] max-[700px]:h-[10rem] shrink-0 max-[500px]:w-[7rem] max-[500px]:h-[7rem] max-[500px]:mr-2 ",
      quantityBtnUI:
        "rounded-xl flex justify-between items-center w-[6rem] h-8 select-none  border-none  bg-[#ea580c] rounded-[13px]",

      heartBtnUI:
        "absolute w-7 h-7 rounded-full p-1 bg-white top-2 right-2 text-red-500 hover:fill-red-600 transition-all duration-300 hover:scale-110 cursor-pointer z-[5] max-[700px]:hidden",
      addToCartBtnUI:
        "rounded-[13px] text-sm h-[2rem] w-[6rem] active:scale-95 transition-all duration-200 text-[#ea580c] relative border border-[#ea580c] hover:bg-[#ff28281c] bg-[#ff28281c] text-lg max-[700px]:bg-[#ffe1e1] max-[700px]:hover:bg-[#ffe1e1]",

      quantityBtnIncreaseUI:
        "rounded-full transition-all duration-200 bg-transparent  text-black text-2xl h-full w-[2.3rem] px-2 active:scale-[0.8] text-white font-bold",

      quantityBtnUILarge:
        "hidden max-[700px]:flex items-center justify-center p-2 absolute -bottom-5 left-1/2 transform -translate-x-1/2 z-[9]",
    },
  ];
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
    <div className="">
      <main className={`${UI[0].cardStructure} ${status === "out_of_stock" ? "grayscale-[100%]" : ""} `}>
        {/* mark availability status */}
        <div
          style={{ boxShadow: "1px 7px 10px #000000ab" }}
          className={`${status === "out_of_stock" ? "-right-[2.7rem]" : "-right-[2.2rem]"} absolute z-10  rotate-90  top-[6rem] flex items-start  bg-white rounded-lg p-3 py-0 rounded-t-none  h-[2rem] max-[700px]:hidden pt-0`}
        >
          {status && (
            <p
              className={`text-sm font-semibold mt-1 flex items-center gap-1 ${
                statusOptions.find((option) => option.value === status)?.color
              }`}
            >
              {statusOptions.find((option) => option.value === status)?.icon}
              {statusOptions.find((option) => option.value === status)?.label}
            </p>
          )}
        </div>
        <section className={`${UI[0].imageSection}  `}>
          <HoverInfo className="z-10 absolute max-[700px]:hidden h-7 w-7" />
          <Heart className={`${UI[0].heartBtnUI} `} />

          {/* mark image */}
          <div className="relative w-full h-full overflow-hidden rounded-xl">
            {discount > 0 && (
              <section>
                <div className="absolute sm:flex hidden top-[1.2rem] -left-[1.6rem] w-[7rem] h-[1.5rem] bg-yellow-300 z-10 -rotate-45 items-center justify-center ">
                  {discount > 0 && (
                    <span
                      className="text-red-500 text-xs font-bold "
                      style={{ textShadow: "1px 2px 2px white" }}
                    >
                      {discount}% OFF
                    </span>
                  )}
                </div>
                <div
                  className="absolute flex sm:hidden  w-[7rem] h-[1.5rem] bg-yellow-300 z-10 items-center justify-center  
              -right-[2rem] rotate-45 top-[1.2rem]"
                >
                  {discount > 0 && (
                    <span
                      className="text-red-500 text-xs font-bold "
                      style={{ textShadow: "1px 2px 2px white" }}
                    >
                      {discount}% OFF
                    </span>
                  )}
                </div>
              </section>
            )}

            <Image src={image} alt={name} fill className="object-cover" />
          </div>

          <section className={`${UI[0].quantityBtnUILarge}`}>
            {/* add to cart button */}
            {quantity === 0 && (
              <Button
                onClick={() =>
                  handleCartClick(
                    id,
                    name,
                    price,
                    quantity,
                    discount,
                    isVeg,
                    status,
                    preparationTime
                  )
                }
                className={`${UI[0].addToCartBtnUI}  ${
                  isPending ? "opacity-50 cursor-not-allowed" : ""
                } `}
              >
                <Plus className="absolute top-1 right-1" />
                {isPending ? <Loader2 className="animate-spin" /> : "Add"}
              </Button>
            )}

            {quantity > 0 && (
              <div className={`${UI[0].quantityBtnUI} `}>
                <Minus
                  onClick={() => handleQuantityDecrease(id)}
                  className={`${UI[0].quantityBtnIncreaseUI} hover:bg-gradient-to-r  `}
                />

                <span className=" text-white font-bold">{quantity}</span>
                <Plus
                  onClick={() => handleQuantityIncrease(id)}
                  className={`${UI[0].quantityBtnIncreaseUI} hover:bg-gradient-to-l`}
                />
              </div>
            )}
          </section>
        </section>

        {/* mark hide in mobile this section */}
        <div className="max-[700px]:w-[100%] flex flex-col justify-between min-[700px]:h-full">
          <section className="p-3 pb-0">
            <h3
              style={{ lineHeight: ".9" }}
              className="text-lg font-semibold max-[700px]:text-[16px] "
            >
              {name}
            </h3>
            {/* idea: Add a star rating <RatingComponent/> */}
            <p className="text-sm text-gray-500 line-clamp-3 h-[2.5rem]s my-2">
              {description}
            </p>
            <h1 className="min-[700px]:hidden text-[13px] font-semibold">
              ₹{price}
            </h1>

            <div className="min-[700px]:hidden">
              {status && (
                <p
                  className={`text-sm font-semibold mt-1 flex items-center gap-1 ${
                    statusOptions.find((option) => option.value === status)
                      ?.color
                  }`}
                >
                  {
                    statusOptions.find((option) => option.value === status)
                      ?.icon
                  }
                  {
                    statusOptions.find((option) => option.value === status)
                      ?.label
                  }
                </p>
              )}
            </div>
            {/* mark hover info, heart, veg icon */}
            <div className="flex items-center gap-2 pt-2 min-[700px]:hidden">
              <HoverInfo className="z-10 h-6 w-6 border-dashed !border-[#bfbfbf]" />
              <Heart
                className={`z-10 h-6 w-6 border-dashed !border-[#bfbfbf] p-1 rounded-full border`}
              />
              {isVeg ? (
                <div className="border rounded-[2px] border-green-500 flex items-center justify-center p-1">
                  <span className="rounded-full bg-green-500 h-[.6rem] w-[.6rem]"></span>
                </div>
              ) : (
                <div className="border rounded-[2px] border-red-500 flex items-center justify-center p-1">
                  <Triangle className="text-red-500 h-[.6rem] w-[.6rem] fill-current" />
                </div>
              )}
            </div>
          </section>

          {/* mark add to cart button */}
          <section className="max-[700px]:hidden flex items-center justify-between p-2 relative  pb-5">
            <h1 className="text-xl font-bold">₹{price}</h1>
            {quantity === 0 && (
              <Button
                onClick={() =>
                  handleCartClick(
                    id,
                    name,
                    price,
                    quantity,
                    discount,
                    isVeg,
                    status,
                    preparationTime
                  )
                }
                className={`${UI[0].addToCartBtnUI}  ${
                  isPending ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Plus className="absolute top-1 right-1" />

                {isPending ? <Loader2 className="animate-spin" /> : "Add"}
              </Button>
            )}

            {quantity > 0 && (
              <div className={`${UI[0].quantityBtnUI} `}>
                <Minus
                  onClick={() => handleQuantityDecrease(id)}
                  className={`${UI[0].quantityBtnIncreaseUI} hover:bg-gradient-to-r  `}
                />

                <span className=" text-white font-bold">{quantity}</span>
                <Plus
                  onClick={() => handleQuantityIncrease(id)}
                  className={`${UI[0].quantityBtnIncreaseUI} hover:bg-gradient-to-l`}
                />
              </div>
            )}
          </section>
        </div>
      </main>
      <hr className="my-1 w-[90%] mx-auto border-dashed border-[#bfbfbf] border-1 min-[700px]:hidden" />
    </div>
  );
}
