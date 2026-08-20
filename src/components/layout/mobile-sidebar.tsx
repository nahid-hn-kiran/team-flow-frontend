"use client";

import { Sheet, SheetContent } from "@/components/ui/sheet";

import { AppSidebar } from "./app-sidebar";

interface MobileSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileSidebar({ open, onOpenChange }: MobileSidebarProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-72 p-0">
        <AppSidebar mobile onClose={() => onOpenChange(false)} />
      </SheetContent>
    </Sheet>
  );
}
