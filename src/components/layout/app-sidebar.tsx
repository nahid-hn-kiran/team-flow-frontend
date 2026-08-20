"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BriefcaseBusiness,
  ChevronRight,
  FolderKanban,
  LayoutDashboard,
  Users,
  Activity,
  Settings,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";

interface AppSidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const mainNavigation = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Workspaces",
    href: "/workspaces",
    icon: BriefcaseBusiness,
  },
];

function getWorkspaceId(pathname: string) {
  const match = pathname.match(/^\/workspaces\/([^/]+)/);

  return match?.[1] ?? null;
}

export function AppSidebar({ mobileOpen, onCloseMobile }: AppSidebarProps) {
  const pathname = usePathname();

  const workspaceId = getWorkspaceId(pathname);

  const workspaceBasePath = workspaceId ? `/workspaces/${workspaceId}` : null;

  const workspaceNavigation = workspaceBasePath
    ? [
        {
          label: "Overview",
          href: workspaceBasePath,
          icon: LayoutDashboard,
        },
        {
          label: "Projects",
          href: `${workspaceBasePath}/projects`,
          icon: FolderKanban,
        },
        {
          label: "Members",
          href: `${workspaceBasePath}/members`,
          icon: Users,
        },
        {
          label: "Activity",
          href: `${workspaceBasePath}/activity`,
          icon: Activity,
        },
      ]
    : [];

  const isActiveMainRoute = (href: string) => {
    if (href === "/workspaces") {
      return pathname === "/workspaces";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const isActiveWorkspaceRoute = (href: string) => {
    if (href === workspaceBasePath) {
      return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r bg-background transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b px-5">
          <Link
            href="/dashboard"
            className="flex items-center gap-3"
            onClick={onCloseMobile}
          >
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
              T
            </div>

            <div>
              <p className="font-semibold tracking-tight">TeamFlow</p>

              <p className="text-[11px] text-muted-foreground">
                Project management
              </p>
            </div>
          </Link>

          <button
            type="button"
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
            onClick={onCloseMobile}
            aria-label="Close sidebar"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4">
          <div>
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Workspace management
            </p>

            <nav className="space-y-1">
              {mainNavigation.map((item) => {
                const Icon = item.icon;

                const active = isActiveMainRoute(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onCloseMobile}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <Icon className="size-[18px]" />

                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Current workspace */}
          {workspaceBasePath && (
            <div className="mt-8">
              <div className="mb-2 flex items-center justify-between px-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Current workspace
                </p>

                <Link
                  href={workspaceBasePath}
                  onClick={onCloseMobile}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ChevronRight className="size-3.5" />
                </Link>
              </div>

              <div className="mb-3 flex items-center gap-3 rounded-xl bg-muted/60 px-3 py-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-background text-xs font-semibold shadow-sm">
                  W
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">Workspace</p>

                  <p className="truncate text-xs text-muted-foreground">
                    Active workspace
                  </p>
                </div>
              </div>

              <nav className="space-y-1">
                {workspaceNavigation.map((item) => {
                  const Icon = item.icon;

                  const active = isActiveWorkspaceRoute(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onCloseMobile}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      <Icon className="size-[17px]" />

                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}

          {/* Bottom settings */}
          <div className="mt-8">
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Account
            </p>

            <Link
              href="/settings"
              onClick={onCloseMobile}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                pathname.startsWith("/settings")
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Settings className="size-[18px]" />

              <span>Settings</span>
            </Link>
          </div>
        </div>

        {/* Sidebar footer */}
        <div className="border-t p-4">
          <div className="rounded-xl bg-muted/50 p-3">
            <p className="text-xs font-medium">TeamFlow</p>

            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
              Manage your workspaces, projects and tasks in one place.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
