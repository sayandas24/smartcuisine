import type { Metadata } from "next"; 
// import "../globals.css"; 

 
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
    <div>
          {children}
    </div> 
  );
}
