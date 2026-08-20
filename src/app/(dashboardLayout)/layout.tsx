import type { ReactNode } from "react";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { UserMenu } from "@/components/layout/user-menu";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return <DashboardShell userMenu={<UserMenu />}>{children}</DashboardShell>;
}
