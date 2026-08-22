"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAuth } from "@/providers/auth-provider";
import { authService } from "@/services/auth.service";

function getInitials(name: string) {
  if (!name) {
    return "U";
  }

  return name
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatRole(role: string) {
  return role
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function UserMenu() {
  const router = useRouter();

  const { user, clearUser } = useAuth();

  const handleLogout = async () => {
    try {
      await authService.logout();

      clearUser();

      toast.success("Logged out successfully.");

      router.replace("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);

      toast.error("Unable to log out. Please try again.");
    }
  };

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        type="button"
        className="flex h-auto items-center gap-3 rounded-lg px-2 py-1.5 outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Avatar className="size-9">
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>

        <div className="hidden min-w-0 text-left sm:block">
          <p className="max-w-32 truncate text-sm font-medium">{user.name}</p>

          <p className="text-xs text-muted-foreground">
            {formatRole(user.role)}
          </p>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        side="bottom"
        sideOffset={8}
        className="w-64"
      >
        <DropdownMenuLabel>
          <div className="flex items-center gap-3 py-1">
            <Avatar className="size-10">
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{user.name}</p>

              <p className="truncate text-xs font-normal text-muted-foreground">
                {user.email}
              </p>

              <p className="mt-1 text-xs font-normal text-muted-foreground">
                {formatRole(user.role)}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem variant="destructive" onClick={handleLogout}>
          <LogOut />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
