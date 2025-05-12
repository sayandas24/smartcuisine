"use client";

import React, { useLayoutEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import HomeCategoryItems from "./HomeCategoryItems";
import { fetchCategory } from "@/helpers/fetchCategory";
import AllCategoryItems from "./AllCategoryItems";

export default function HomePageFilter() {
  const [category, setCategory] = React.useState([]);

  const refreshCategories = async () => {
    try {
      const data = await fetchCategory();
      setCategory(data.categories);
    } catch (err) {
      console.log("error in fetching category", err);
    }
  };

  useLayoutEffect(() => {
    refreshCategories();
  }, []);

  return (
    <Tabs defaultValue="All" className="w-full">
      <div className="flex justify-center w-full sticky  rounded-b-3xl top-11 left-0 z-[30] max-[700px]:top-[28px]">
        <TabsList className="my-2 rounded-full max-[700px]:w-full max-[700px]:rounded-none max-[700px]:bg-[#ffffffd6] backdrop-blur-sm max-[700px]:justify-start ">
          <TabsTrigger value={"All"} className="rounded-full max-[700px]:py-1 ">
            All
          </TabsTrigger>
          {category.map((link: any) => (
            <TabsTrigger
              key={link.id}
              value={link.name}
              className="rounded-full max-[700px]:py-1"
            >
              {link.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {category.map((cat: any) => (
        <div key={cat.id}>
          <TabsContent value={cat.name}>
            <HomeCategoryItems itemCategoryId={cat.id} />
          </TabsContent>
        </div>
      ))}
      <TabsContent value="All">
        <AllCategoryItems/>
      </TabsContent>
    </Tabs>
  );
}
