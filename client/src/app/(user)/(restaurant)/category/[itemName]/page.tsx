"use client";

import FoodItemCard from "@/components/restaurant/foodItem/FoodItemCard";
import { getFoodByCategory, getFoodItems } from "@/data/foodItem";
import React, { useEffect, useState } from "react";
import { useItemStore } from "@/store/orderStore";
import { useParams } from "next/navigation";
import { useInventoryItems } from "@/hooks/useInventoryItems";
import { fetchCategory } from "@/helpers/fetchCategory";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
}

export default function ItemName() {
  const params = useParams();
  const { itemName } = params as { itemName: string };
  const [category, setCategory] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<any | 0>(undefined);

  const refreshCategories = async () => {
    try {
      const data = await fetchCategory();
      setCategory(data.categories);
    } catch (err) {
      console.log("error in fetching category", err);
    }
  };

  useEffect(() => {
    refreshCategories();
  }, []);

  // Find the category ID when categories or itemName changes
  useEffect(() => {
    if (category.length > 0 && itemName) {
      const foundCategory = category.find(
        (item) => item.name.toLowerCase() === itemName
      );
      setCategoryId(foundCategory?.id);
    }
  }, [category, itemName]);

  const {
    items: foodItems,
    loading,
    error,
    refetch,
  } = useInventoryItems(categoryId);
  const cartItems = useItemStore((state) => state.items);

  return (
    <div className="flex flex-wrap gap-4 max-[700px]:flex-col max-w-[65rem] mx-auto justify-center">
      {loading ? (
        <div className="flex justify-center items-center w-full h-60">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : foodItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center w-full py-16 px-4">
          <div className="w-32 h-32 mb-6 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
              <path d="M3.5 12.5l5-5"></path>
              <path d="M20.5 12.5l-5-5"></path>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No items found
          </h3>
          <p className="text-gray-500 text-center max-w-md mb-6">
            There are currently no items available in this category. Please
            check back later or explore other categories.
          </p>
          <Link
            href="/"
            className="px-6 py-2.5 bg-btnColor text-white rounded-full hover:bg-btnColorHover transition-colors"
          >
            Explore Menu
          </Link>
        </div>
      ) : (
        foodItems.map((item) => {
          const cartItem = cartItems.find(
            (cartItem) => cartItem.id === item.id
          );
          return (
            <FoodItemCard
              key={item.id}
              id={item.id}
              name={item.name}
              description={item.description}
              price={item.cost_price}
              image={item.img}
              category={item.category}
              quantity={cartItem?.quantity || 0}
              discount={item.discount}
              isVeg={item.is_veg}
              status={item.status}
              preparationTime={item.preparation_time}
            />
          );
        })
      )}
    </div>
  );
}
