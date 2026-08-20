import type { UserRole } from "@/lib/auth-utils";
import {
  CheckSquare,
  FolderKanban,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";

export interface NavigationItem {
  title: string;
  href: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
  roles: UserRole[];
}

export const navigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    roles: ["SUPER_ADMIN", "ADMIN"],
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
    roles: ["SUPER_ADMIN", "ADMIN"],
  },
  {
    title: "Admins",
    href: "/admin/admins",
    icon: ShieldCheck,
    roles: ["SUPER_ADMIN"],
  },
  {
    title: "Projects",
    href: "/admin/projects",
    icon: FolderKanban,
    roles: ["SUPER_ADMIN", "ADMIN"],
  },
  {
    title: "Tasks",
    href: "/admin/tasks",
    icon: CheckSquare,
    roles: ["SUPER_ADMIN", "ADMIN"],
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    roles: ["SUPER_ADMIN", "ADMIN"],
  },
];

export const userNavigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    href: "/workspaces",
    icon: LayoutDashboard,
    roles: ["USER"],
  },
  {
    title: "My Projects",
    href: "/workspaces/projects",
    icon: FolderKanban,
    roles: ["USER"],
  },
  {
    title: "My Tasks",
    href: "/workspaces/tasks",
    icon: CheckSquare,
    roles: ["USER"],
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    roles: ["USER"],
  },
];
