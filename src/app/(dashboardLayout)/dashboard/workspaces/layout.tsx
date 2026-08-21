import type { ReactNode } from "react";

interface WorkspaceLayoutProps {
  children: ReactNode;
}

export default function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  return <div className="min-w-0">{children}</div>;
}
