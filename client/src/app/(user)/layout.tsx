import type { Metadata } from "next";
import "../globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/sonner";
import { Jost } from "next/font/google";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/components/header/Header";
import CartWrapper from "@/components/restaurant/cart/CartWrapper";
import MobileNav from "@/components/navigation/MobileNav";
import StoreProvider from "@/context/StoreProvider";

const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jost",
});

export const metadata: Metadata = {
  title: "Smart Cuisine",
  description: "Restaurant management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="darks">
      <AuthProvider>
        <body
          suppressHydrationWarning={true}
          className={`${jost.className} antialiased bg-[#fcfeff] dark:bg-[#1f1f1f]`}
        >
          <StoreProvider>
            <SidebarProvider className="darks">
              <AppSidebar />
              <SidebarInset className="relative">
                <Header />
                {/* body content */}
                <div className="">
                  <Toaster position="top-center"/>
                  {children}
                </div>
                <div className="mt-[6rem]">
                  <CartWrapper />
                </div>
                <MobileNav />
              </SidebarInset>
            </SidebarProvider>
          </StoreProvider>
        </body>
      </AuthProvider>
    </html>
  );
}
