/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FoodBank } from "@mui/icons-material";
import { Edit, Loader2 } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import EditCategory from "./EditCategory";
import ShowItem from "../inventory/ShowItem";
import AddItem from "../inventory/AddItem";

export default function CategoryItem({ categories, onEditSuccess }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [editCategory, setEditCategory] = useState("");
  const [loadingImageId, setLoadingImageId] = useState<string | null>(null);

  const onEditClick = (category: any) => {
    setIsOpen(true);
    setEditCategory(category);
  };

  const handleDialogClose = (open: boolean) => {
    setIsOpen(open);

    if (!open && onEditSuccess) {
      onEditSuccess();
    }
  };
  const formSubmitted = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <main className="flexl gap-4 flex-wrap grid grid-cols-2  max-[1100px]:grid-cols-1 max-[1100px]:w-[40rem] max-[700px]:w-[100%]">
        {categories &&
          categories.map((category: any) => (
            <Accordion
              key={category.id}
              type="single"
              collapsible
              className="rounded-xl w-full"
            >
              <AccordionItem value="item-1" className="border rounded-xl">
                <div className="flex  gap-4 p-2 justify-between">
                  <section className="bg-[#c8bcab3a] rounded-xl h-[5rem] w-[5rem] relative shrink-0">
                    {category.img ? (
                      <>
                        {loadingImageId === category.id && (
                          <div className="absolute inset-0 z-10">
                            <Skeleton className="h-full w-full rounded-xl" />
                          </div>
                        )}
                        <img
                          src={category.img}
                          alt={category.name}
                          loading="lazy"
                          className="object-cover w-full h-full rounded-xl"
                          onLoad={() => setLoadingImageId(null)}
                          onError={() => setLoadingImageId(null)}
                        />
                      </>
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-zinc-400">
                        No image
                      </div>
                    )}
                  </section>
                  <section className="flex-1 flex flex-col gap-1 max-w-[20rem] ">
                    <div className="font-[500] text-xl">{category.name}</div>
                    <div className="leading-4 text-sm text-zinc-600">
                      {category.description}
                    </div>
                  </section>

                  {/* Edit category */}
                  <section className="flex items-center gap-2">
                    <AccordionTrigger className="p-0  items-center gap-2 border border-green-500 text-green-500 hover:text-green-500 hover:bg-[#21c70030] font-medium transition-all px-2 !py-1 rounded-xl text-xs cursor-pointer ">View Items</AccordionTrigger>
                    <section
                      onClick={() => onEditClick(category)}
                      className=""
                    >
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="flex items-center gap-2 border border-btnColor text-btnColor hover:text-btnColor hover:bg-[#c771003a] font-medium transition-all px-2 !py-1 rounded-xl text-xs cursor-pointer">
                              <Edit className="w-5 h-5 text-btnColor" />
                              Edit Category
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit this category</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </section>
                  </section>
                </div>
                <AccordionContent className="p-3 border-t ">
                  {/* mark category add and show item listed here */}
                  <ul className="flex flex-col gap-2">
                    <div>
                      <AddItem
                        category_id={category.id}
                        allCategories={categories}
                      />
                    </div>
                    <li className="flex gap-2 rounded-xl items-center list-disc">
                      <ShowItem categoryId={category.id} />
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
      </main>
      {isOpen && editCategory && (
        <EditCategory
          category={editCategory}
          onSuccess={onEditSuccess}
          formSubmitted={formSubmitted}
        />
      )}
    </Dialog>
  );
}
