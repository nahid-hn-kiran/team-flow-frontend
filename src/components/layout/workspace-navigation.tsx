"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, FolderKanban, LayoutDashboard, Users } from "lucide-react";

import { cn } from "@/lib/utils";

interface WorkspaceNavigationProps {
  workspaceId: string;
}

const navigationItems = [
  {
    label: "Overview",
    href: "",
    icon: LayoutDashboard,
  },
  {
    label: "Projects",
    href: "/projects",
    icon: FolderKanban,
  },
  {
    label: "Members",
    href: "/members",
    icon: Users,
  },
  {
    label: "Activity",
    href: "/activity",
    icon: Activity,
  },
];

export function WorkspaceNavigation({ workspaceId }: WorkspaceNavigationProps) {
  const pathname = usePathname();

  const basePath = `/dashboard/workspaces/${workspaceId}`;

  return (
    <nav className="border-b">
      <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 sm:px-6 lg:px-8">
        {navigationItems.map((item) => {
          const href = `${basePath}${item.href}`;

          const isActive =
            item.href === ""
              ? pathname === basePath
              : pathname === href || pathname.startsWith(`${href}/`);

          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={href}
              className={cn(
                "relative flex shrink-0 items-center gap-2 px-3 py-3 text-sm font-medium transition-colors",
                "text-muted-foreground hover:text-foreground",
                isActive &&
                  "text-foreground after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-foreground",
              )}
            >
              <Icon className="size-4" />

              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
