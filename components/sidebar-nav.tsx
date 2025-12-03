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
  const { setOpenMobile, isMobile, openMobile } = useSidebar();
  const prevPathnameRef = useRef(pathname);

  console.log(
    "SidebarNav render - isMobile:",
    isMobile,
    "openMobile:",
    openMobile,
    "pathname:",
    pathname
  );

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
    console.log(
      "🔴 handleNavigation called - path:",
      path,
      "isMobile:",
      isMobile
    );
    // Close the sidebar immediately
    setOpenMobile(false);
    console.log("🔴 setOpenMobile(false) called");
    // Navigate to the path
    router.push(path);
    console.log("🔴 router.push called");
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
                onClick={() => {
                  console.log("🟢 BUTTON CLICKED - Products List");
                  handleNavigation("/products");
                }}
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
                onClick={() => {
                  console.log("🟢 BUTTON CLICKED - Add Product");
                  handleNavigation("/products/add");
                }}
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
