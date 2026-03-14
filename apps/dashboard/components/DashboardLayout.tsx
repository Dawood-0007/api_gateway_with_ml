import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSideBar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 flex items-center border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
            <SidebarTrigger className="ml-3" />
            <div className="ml-auto mr-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse-green" />
              <span className="text-xs font-mono text-muted-foreground">System Active</span>
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
