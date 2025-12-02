import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Package, Plus, List } from "lucide-react";

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
          <Sidebar>
            <SidebarHeader className="h-16 border-b">
              <div className="flex h-full items-center gap-2 px-3">
                <div className="flex size-8 items-center justify-center rounded-full border-2">
                  <Package className="size-4" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-sm leading-tight">
                    Product
                  </span>
                  <span className="font-bold text-sm leading-tight">
                    Dashboard
                  </span>
                </div>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel className="px-3 text-xs">
                  Products
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild size="sm">
                        <Link href="/products">
                          <List className="size-4" />
                          <span>Products List</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild size="sm">
                        <Link href="/products/add">
                          <Plus className="size-4" />
                          <span>Add Product</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1" />
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
