"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { useAuth } from "@/providers/auth-provider";
import { AuthLoading } from "@/components/modules/Auth/auth-loading";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isAuthenticated) {
      router.replace("/auth/login");
      return;
    }

    if (user?.role !== "ADMIN" && user?.role !== "SUPER_ADMIN") {
      router.replace("/workspace");
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return <AuthLoading />;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (user?.role !== "ADMIN" && user?.role !== "SUPER_ADMIN") {
    return null;
  }

  return <DashboardShell>{children}</DashboardShell>;
}
