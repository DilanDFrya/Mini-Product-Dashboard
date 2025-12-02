"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { Plus, List } from "lucide-react"

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel className="px-3 text-xs text-sidebar-foreground/70">
          Products
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                size="sm"
                tooltip="Products List"
                isActive={pathname === "/products"}
                className="data-[active=true]:bg-sidebar-primary/15 data-[active=true]:text-sidebar-primary data-[active=true]:font-semibold [&_svg]:data-[active=true]:text-sidebar-primary"
              >
                <Link href="/products">
                  <List className="size-4" />
                  <span>Products List</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                size="sm"
                tooltip="Add Product"
                isActive={pathname === "/products/add"}
                className="data-[active=true]:bg-sidebar-primary/15 data-[active=true]:text-sidebar-primary data-[active=true]:font-semibold [&_svg]:data-[active=true]:text-sidebar-primary"
              >
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
  )
}

