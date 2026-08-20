"use client";

import { useState } from "react";
import type { ReactNode } from "react";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { DashboardHeader } from "@/components/layout/dashboard-header";

interface DashboardShellProps {
  children: ReactNode;
  userMenu?: ReactNode;
}

export function DashboardShell({ children, userMenu }: DashboardShellProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-muted/20">
      <AppSidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader
          onMenuClick={() => setMobileSidebarOpen(true)}
          userMenu={userMenu}
        />

        <main className="flex-1">
          <div className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
