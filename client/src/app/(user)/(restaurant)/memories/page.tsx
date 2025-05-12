import React from "react";
import MemoriesCard from "@/components/restaurant/memories/MemoriesCard";
export default function page() {
  return (
    <main className="mb-[3rem]">
      <div className="w-[70rem] max-[1200px]:w-[90%] max-[600px]:w-[95%] mx-auto p-1 sm:p-4 flex flex-wrap gap-3 items-center max-[600px]:hidden">
        <MemoriesCard />
        <MemoriesCard />
        <MemoriesCard />
        <MemoriesCard />
        <MemoriesCard />
        <MemoriesCard />
      </div>
      <div className="max-[600px]:w-[98%] mx-auto p-1 flex max-[360px]:flex-col gap-1 items-center justify-center min-[600px]:hidden">
        <MemoriesCard />
        <MemoriesCard />
      </div>
      <div className="max-[600px]:w-[98%] mx-auto p-1 flex max-[360px]:flex-col gap-1 items-center justify-center min-[600px]:hidden">
        <MemoriesCard />
        <MemoriesCard />
      </div>
    </main>
  );
}
