"use client";

import { ReactNode } from "react";
import { QueryProvider } from "./query-provider";
import { Toaster } from "sonner";

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <QueryProvider>
      {children}
      <Toaster position="top-right" richColors />
    </QueryProvider>
  );
}
