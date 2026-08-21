"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Activity, ArrowLeft, LayoutDashboard, Users } from "lucide-react";
import { useParams, usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

interface WorkspaceLayoutProps {
  children: ReactNode;
}

const navigationItems = [
  {
    label: "Overview",
    href: "",
    icon: LayoutDashboard,
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

export default function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  const params = useParams<{
    workspaceId: string;
  }>();

  const pathname = usePathname();

  const workspaceId = params.workspaceId;

  const basePath = `/dashboard/workspaces/${workspaceId}`;

  return (
    <div className="space-y-6">
      <div className="border-b">
        <div className="flex items-center gap-3 overflow-x-auto pb-3">
          <Link
            href="/dashboard//workspaces"
            className="flex size-9 shrink-0 items-center justify-center rounded-lg border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="Back to workspaces"
          >
            <ArrowLeft className="size-4" />
          </Link>

          <nav className="flex items-center gap-1">
            {navigationItems.map((item) => {
              const href = `${basePath}${item.href}`;

              const isActive =
                item.href === ""
                  ? pathname === basePath
                  : pathname.startsWith(href);

              const Icon = item.icon;

              return (
                <Link
                  key={item.label}
                  href={href}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  )}
                >
                  <Icon className="size-4" />

                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div>{children}</div>
    </div>
  );
}
