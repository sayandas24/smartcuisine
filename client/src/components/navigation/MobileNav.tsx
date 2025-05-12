"use client"; 
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Home, HomeOutlined, AlternateEmail, AlternateEmailOutlined, DeliveryDiningOutlined, DeliveryDining, AccountCircleOutlined, AccountCircle, FastfoodOutlined, Fastfood } from "@mui/icons-material";
import { controlNavbarScroll, useNavVisibility } from "@/utils/scrollUtils";

export default function MobileNav() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);
  const setNavVisible = useNavVisibility((state) => state.setNavVisible);

  // Client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Function to control navbar visibility on scroll
  const controlNavbar = () => {
    if (typeof window !== 'undefined') {
      const currentScrollY = window.scrollY;
      
      controlNavbarScroll({
        currentScrollY,
        lastScrollY,
        setVisible,
        setLastScrollY,
      });
    }
  };

  // Update global state when component state changes
  useEffect(() => {
    setNavVisible(visible);
  }, [visible, setNavVisible]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);
      
      // Cleanup
      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }
  }, [lastScrollY]);

  // Don't render anything on server-side
  if (!mounted) return null;

  const links = [
    {
      href: "/",
      icon: Home,
      outlinedIcon: HomeOutlined,
      label: "Home",
      active: pathname === "/",
    },
    {
      href: "/memories",
      icon: AlternateEmail,
      outlinedIcon: AlternateEmailOutlined,
      label: "Memories",
      active: pathname === "/memories",
    },
    {
      href: "/category",
      icon: Fastfood,
      outlinedIcon: FastfoodOutlined,
      label: "Categories",
      active: pathname === "/category",
    },
    {
      href: "/orders",
      icon: DeliveryDining,
      outlinedIcon: DeliveryDiningOutlined,
      label: "Orders",
      active: pathname === "/orders",
    },
    {
      href: "/user/p",
      icon: AccountCircle,
      outlinedIcon: AccountCircleOutlined,
      label: "Profile",
      active: pathname === "/user/p",
    },
  ];

  return (
    <div className={`fixed bottom-0 w-full z-50 min-[700px]:hidden max-w-[20rem]d left-1/2 -translate-x-1/2 max-[450px]:max-w-[100%] max-[450px]:w-[100%] border-t border-t-gray-200 bg-[#ffffff] transition-transform duration-300 ${visible ? 'translate-y-0' : 'translate-y-full'}`}>
      <section className="flex items-center justify-between gap-5 pt-2">
        {links.map((link) => (
          <Link
            href={link.href}
            key={link.href}
            className={`${link.active ? "border-b-4 border-[#c77b00] rounded-[5px]" : "border-b-4 border-transparent"} flex max-[450px]:flex-col items-center justify-center gap-1 w-[6rem] h-[3rem]`}
          >
            {link.active ? (
              <link.icon
                className={`w-7 h-7 ${link.active ? "text-[#c77b00]" : "text-zinc-600"}`}
              />
            ) : (
              <link.outlinedIcon
                className={`w-7 h-7 ${link.active ? "text-[#c77b00]" : "text-zinc-600"}`}
              />
            )}
            <p
              className={`text-xs ${link.active ? "text-[#c77b00]" : "text-zinc-600"}`}
            >
              {link.label}
            </p>
          </Link>
        ))}
      </section>
    </div>
  );
}
