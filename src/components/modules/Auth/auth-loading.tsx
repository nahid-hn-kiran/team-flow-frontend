"use client";

import { Loader2 } from "lucide-react";

export function AuthLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Loader2 className="size-5 animate-spin" />
        </div>

        <p className="text-sm text-muted-foreground">
          Loading your workspace...
        </p>
      </div>
    </div>
  );
}
