import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Package } from "lucide-react";
import { SidebarNav } from "@/components/sidebar-nav";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Product Dashboard",
  description: "Manage your products",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SidebarProvider>
          <Sidebar collapsible="icon">
            <SidebarHeader className="h-16 border-b border-sidebar-border bg-sidebar">
              <div className="flex h-full items-center justify-start gap-2 px-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2">
                <div className="flex size-8 items-center justify-center rounded-full border-2 border-sidebar-primary/30 bg-sidebar-primary/10 shrink-0">
                  <Package className="size-4 text-sidebar-primary" />
                </div>
                <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                  <span className="font-bold text-sm leading-tight">
                    Product
                  </span>
                  <span className="font-bold text-sm leading-tight">
                    Dashboard
                  </span>
                </div>
              </div>
            </SidebarHeader>
            <SidebarNav />
          </Sidebar>
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background px-4">
              <SidebarTrigger className="-ml-1" />
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
          </SidebarInset>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
