"use client";
import { Rating } from "@mui/material";
import React from "react";

export default function MemoriesCard() {
  return (
    <div className="border relative rounded-xl p-3 min-[600px]:w-[15rem] min-[600px]:h-[20rem] bg-cover bg-center overflow-hidden w-full h-[18rem] shadow-md shadow-black/20">
      <div
        style={{
          backgroundImage:
            "url(https://images.pexels.com/photos/1833349/pexels-photo-1833349.jpeg?cs=srgb&dl=pexels-valeriya-1833349.jpg&fm=jpg)",
        }}
        className="absolute blur-[2px] top-0 left-0 w-full h-full bg-black/20 brightness-75 bg-cover bg-center"
      ></div>
      <div className="flex gap-2 absolute bottom-3 left-3 right-3 text-white">
        <section className="w-7 h-7 rounded-full bg-red-500 shrink-0 overflow-hidden">
          <img
            src="https://i.pinimg.com/736x/ca/7c/f9/ca7cf9fa956618b480e7def896ffb101.jpg"
            alt=""
          />
        </section>

        {/* name and date */}
        <section className="">
          <div className="flex gap-2 items-center">
            <h1>Mia</h1>
            <Rating
              name="half-rating-read"
              size="small"
              defaultValue={4.5}
              precision={0.5}
              readOnly
            />
          </div>
          <p className="leading-4 text-sm">
            Awsome experience with my family great food and service. The staff
            was very friendly and the food was delicious.
          </p>
        </section>
      </div>
    </div>
  );
}
