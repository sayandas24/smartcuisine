import { Flame, Headset } from "lucide-react";
import React from "react";

export default function ProfileHeader() {
  return (
    <div>
      <hr />
      <header className="flex justify-between items-center p-5 py-2 ">
        <ul className="flex gap-4 text-sm h-5">
          <li className="flex gap-1 items-center">
            <Flame className="h-5 w-5 text-orange-600 fill-orange-500" /> Hot
            Deals
          </li>
          <li>About Us</li>
          <li>Contact Us</li>
        </ul>
        <div className="flex items-center gap-2 max-[500px]:hidden">
          <Headset className="h-8 w-8" />
          <section>
            <h1 className="text-[#c77b00] font-semibold">+91 9089907867</h1>
            <h2 className="text-zinc-500 !text-xs">24/7 Support center</h2>
          </section>
        </div>
      </header>
      <hr />
    </div>
  );
}
