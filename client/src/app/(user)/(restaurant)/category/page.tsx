"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchCategory } from "@/helpers/fetchCategory";

interface Category {
  id: string;
  name: string;
  img: string;
}

export default function CategoryItem() {
  const [categoryItems, setCategoryItems] = React.useState<Category[]>([]);

  const refreshCategories = async () => {
    try {
      const data = await fetchCategory();
      setCategoryItems(data.categories);
    } catch (err) {
      console.log("error in fetching category", err);
    }
  };
  useEffect(() => {
    refreshCategories();
  }, []);

  return (
    <main className="max-w-[65rem] mx-auto p-2 sm:p-4">
      <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-6 capitalize">
        Category
      </h1>
      {/* CSS with custom media query at 700px */}
      <style jsx>{`
        .category-grid {
          display: grid;
          gap: 10px;
        }

        /* Mobile layout (2:1 pattern) */
        @media (max-width: 700px) {
          .category-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .category-card {
            height: 7rem;
            border-radius: 0.5rem;
          }

          /* Every 3rd item spans 2 columns and is taller */
          .category-grid > div:nth-child(3n) {
            grid-column: span 2;
            height: 10rem;
            margin-bottom: 0.5rem;
          }
        }

        /* Desktop layout (2:3:1 pattern) */
        @media (min-width: 701px) {
          .category-grid {
            grid-template-columns: repeat(6, 1fr);
            gap: 16px;
          }

          .category-card {
            height: 10rem;
            border-radius: 0.75rem;
          }

          /* First 2 items in each group of 6 span 3 columns */
          .category-grid > div:nth-child(6n + 1),
          .category-grid > div:nth-child(6n + 2) {
            grid-column: span 3;
          }

          /* Middle 3 items in each group of 6 span 2 columns */
          .category-grid > div:nth-child(6n + 3),
          .category-grid > div:nth-child(6n + 4),
          .category-grid > div:nth-child(6n + 5) {
            grid-column: span 2;
          }

          /* Last item in each group of 6 spans full width and is taller */
          .category-grid > div:nth-child(6n) {
            grid-column: span 6;
            height: 20rem;
            margin-bottom: 1rem;
          }
        }
      `}</style>
      <div className="category-grid">
        {categoryItems.map((item) => (
          <div
            // href={`/${item.name}`}
            key={item.id}
            // onClick={() => handleCategoryClick(item.name)}
            className=" category-card relative overflow-hidden border border-gray-500 shadow-sm"
          >
            <Link href={`/category/${item.name.toLowerCase()}`}>
              <div className="absolute inset-0 bg-transparent bg-blue-200">
                <Image
                  src={item.img}
                  alt={item.name}
                  width={500}
                  height={300}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60">
                <h2 className="text-white font-bold text-sm md:text-xl uppercase">
                  {item.name}
                </h2>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
