"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { Plus, List } from "lucide-react";

export function SidebarNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { setOpenMobile } = useSidebar();
  const prevPathnameRef = useRef(pathname);

  // Close mobile sidebar when pathname changes
  useEffect(() => {
    // Check if pathname actually changed (not on initial mount)
    if (pathname !== prevPathnameRef.current) {
      // Close sidebar (only affects mobile since Sheet isn't rendered on desktop)
      setOpenMobile(false);
      // Update the ref to track the current pathname
      prevPathnameRef.current = pathname;
    }
  }, [pathname, setOpenMobile]);

  // Handle navigation - close sidebar and navigate
  const handleNavigation = (path: string) => {
    // Close the sidebar immediately when clicked
    setOpenMobile(false);
    // Navigate to the path
    router.push(path);
  };

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
                size="sm"
                isActive={pathname === "/products"}
                className="data-[active=true]:bg-sidebar-primary/15 data-[active=true]:text-sidebar-primary data-[active=true]:font-semibold [&_svg]:data-[active=true]:text-sidebar-primary"
                onClick={() => handleNavigation("/products")}
              >
                <List className="size-4" />
                <span>Products List</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="sm"
                isActive={pathname === "/products/add"}
                className="data-[active=true]:bg-sidebar-primary/15 data-[active=true]:text-sidebar-primary data-[active=true]:font-semibold [&_svg]:data-[active=true]:text-sidebar-primary"
                onClick={() => handleNavigation("/products/add")}
              >
                <Plus className="size-4" />
                <span>Add Product</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
