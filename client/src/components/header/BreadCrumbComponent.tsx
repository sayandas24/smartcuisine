"use client";
import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbLink,
  BreadcrumbItem,
  BreadcrumbList,
} from "../ui/breadcrumb";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { categoryLinks } from "@/data/categoryLinks";

export default function BreadCrumbComponent() {
  const pathname = usePathname(); 
  const [pathArray, setPathArray] = useState<string[]>([]);

  useEffect(() => { 
    setPathArray(pathname.split("/").slice(1));
  }, [pathname]); 
  
  return (
    <Breadcrumb className="text-nowrap">
      <BreadcrumbList>
        <BreadcrumbItem>
          <Link href="/" passHref legacyBehavior>
            <BreadcrumbLink
              className={`${pathname === "/" ? "text-primary" : ""}`}
            >
              Home
            </BreadcrumbLink>
          </Link>
        </BreadcrumbItem>
        {pathArray.map((path, index) => {
          const currentPath = `/${pathArray.slice(0, index + 1).join("/")}`;
          return (
            <React.Fragment key={index}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {path === "category" ? (
                  <DropdownMenu>
                    <Link href="/category" passHref legacyBehavior>
                      <BreadcrumbLink
                        className={`${pathname === "/category" ? "text-primary" : ""}`}
                      >
                        Category
                      </BreadcrumbLink>
                    </Link>
                    <DropdownMenuTrigger className="flex items-center gap-1">
                      <ChevronDown />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {categoryLinks.map((item) => (
                        <DropdownMenuItem key={item.title}>
                          <Link href={item.url} passHref legacyBehavior>
                            <BreadcrumbLink>
                              {item.title}
                            </BreadcrumbLink>
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link href={currentPath} passHref legacyBehavior>
                    <BreadcrumbLink
                      className={`${pathname === currentPath ? "text-primary" : ""}`}
                    >
                      <>{path.charAt(0).toUpperCase() + path.slice(1)}</>
                    </BreadcrumbLink>
                  </Link>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
