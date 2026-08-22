"use client";

import Link from "next/link";
import { ChevronRight, Menu } from "lucide-react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  onMenuClick: () => void;
  userMenu?: React.ReactNode;
}

function getPageInfo(pathname: string) {
  if (pathname === "/dashboard") {
    return {
      title: "Dashboard",
      section: "Home",
    };
  }

  if (pathname === "/dashboard/workspaces") {
    return {
      title: "Workspaces",
      section: "Workspace management",
    };
  }

  if (pathname.match(/^\/dashboard\/workspaces\/[^/]+$/)) {
    return {
      title: "Workspace",
      section: "Workspace",
    };
  }

  if (pathname.includes("/projects/") && pathname.includes("/tasks/")) {
    return {
      title: "Task",
      section: "Project",
    };
  }

  if (pathname.endsWith("/projects")) {
    return {
      title: "Projects",
      section: "Workspace",
    };
  }

  if (pathname.includes("/members")) {
    return {
      title: "Members",
      section: "Workspace",
    };
  }

  if (pathname.includes("/activity")) {
    return {
      title: "Activity",
      section: "Workspace",
    };
  }

  if (pathname.includes("/projects/")) {
    return {
      title: "Project",
      section: "Workspace",
    };
  }

  return {
    title: "TeamFlow",
    section: "Workspace management",
  };
}

export function DashboardHeader({
  onMenuClick,
  userMenu,
}: DashboardHeaderProps) {
  const pathname = usePathname();

  const pageInfo = getPageInfo(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
          aria-label="Open sidebar"
        >
          <Menu className="size-5" />
        </Button>

        {/* Desktop breadcrumb */}
        <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
          <Link href="/dashboard" className="hover:text-foreground">
            TeamFlow
          </Link>

          <ChevronRight className="size-3.5" />

          <span className="truncate">{pageInfo.section}</span>

          <ChevronRight className="size-3.5" />

          <span className="truncate text-foreground">{pageInfo.title}</span>
        </div>

        {/* Mobile title */}
        <div className="sm:hidden">
          <p className="truncate text-sm font-semibold">{pageInfo.title}</p>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">{userMenu}</div>
    </header>
  );
}
