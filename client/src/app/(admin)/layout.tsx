import Header from "@/components/header/Header";
import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "../globals.css";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/admin/navigation/AppSidebar";
import { Toaster } from "sonner";
import AuthProvider from "@/context/AuthProvider";

const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jost",
});

export const metadata: Metadata = {
  title: "Cuisine Lab",
  description: "Restaurant management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body suppressHydrationWarning={true}>
          <SidebarProvider className="darks">
            <AppSidebar />
            <SidebarInset className="relative">
              {/* <Header /> */}
              {/* body content */}
              <div className="">
                <Toaster position="top-center" />
                {children}
              </div>
            </SidebarInset>
          </SidebarProvider>
        </body>
      </AuthProvider>
    </html>
  );
}
