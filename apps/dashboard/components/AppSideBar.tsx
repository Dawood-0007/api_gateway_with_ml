'use client';

import {
  LayoutDashboard,
  BarChart3,
  ShieldAlert,
  Ban,
  FlaskConical,
  Brain,
  Users,
  ScrollText,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation"; 
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils"; 

const mainItems = [
  { title: "Overview", url: "/", icon: LayoutDashboard },
  { title: "Traffic Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Threat Detection", url: "/detection", icon: ShieldAlert },
  { title: "Blocked IPs", url: "/blocked", icon: Ban },
];

const toolItems = [
  { title: "API Playground", url: "/playground", icon: FlaskConical },
];

const adminItems = [
  { title: "Admin", url: "/admin", icon: Users },
  { title: "Request Logs", url: "/logs", icon: ScrollText },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  
  const pathname = usePathname();

  const renderGroup = (label: string, items: typeof mainItems) => (
    <SidebarGroup>
      <SidebarGroupLabel className="text-sidebar-foreground/50 uppercase text-[10px] tracking-widest font-semibold">
        {label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = pathname === item.url;

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={isActive}>
                  <Link
                    href={item.url}
                    className={cn(
                      "transition-colors hover:bg-sidebar-accent flex items-center w-full",
                      isActive && "bg-sidebar-accent text-sidebar-primary font-semibold"
                    )}
                  >
                    <item.icon className="mr-2 h-4 w-4 shrink-0" />
                    {!collapsed && <span>{item.title}</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg gradient-green flex items-center justify-center shrink-0">
            <Shield className="h-4 w-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-sm font-bold text-sidebar-accent-foreground tracking-tight">SENTINEL</h1>
              <p className="text-[10px] text-sidebar-foreground/50 tracking-wider">WAF DASHBOARD</p>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        {renderGroup("Monitor", mainItems)}
        {renderGroup("Tools", toolItems)}
        {renderGroup("System", adminItems)}
      </SidebarContent>
    </Sidebar>
  );
}