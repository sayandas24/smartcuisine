"use client";

import FoodItemCard from "@/components/restaurant/foodItem/FoodItemCard"; 
import React, { useEffect, useState } from "react";
import { useItemStore } from "@/store/orderStore"; 
import { useInventoryItems } from "@/hooks/useInventoryItems"; 
import { AlertTriangle } from "lucide-react";
import FoodSkeleton from "./FoodSkeleton";
import NoFoodBox from "./NoFoodBox";

export default function AllCategoryItems({
  itemCategoryId,
}: {
  itemCategoryId?: string;
}) {  
  const { allItems, fetchAllItems, loading, error } = useInventoryItems(itemCategoryId);

  const cartItems = useItemStore((state) => state.items);

  useEffect(() => {
    useItemStore.persist.rehydrate();
  }, []);
 

  // Error component
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-xl font-semibold mb-2">Failed to load items</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <button 
          onClick={() => fetchAllItems()} 
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Try Again
        </button>
      </div>
    );
  }

  // No items component
  if (!loading && allItems.length === 0) {
    return (
      <NoFoodBox refetch={fetchAllItems} />
    );
  }

  return (
    <div className="flex flex-wrap gap-6 max-[700px]:flex-col max-w-[65rem] mx-auto justify-center">
      {loading ? (
        // Display skeletons when loading
        Array.from({ length: 8 }).map((_, index) => (
          <div key={`skeleton-${index}`} >

          <FoodSkeleton />
          </div>
        ))
      ) : (
        // Display actual items when loaded
        allItems.map((item: any) => {
          const cartItem = cartItems.find((cartItem) => cartItem.id === item.id);
          return (
            <FoodItemCard
              key={item.id}
              id={item.id}
              name={item.name}
              description={item.description}
              price={item.cost_price}
              image={item.img}
              category={item.category_id}
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
