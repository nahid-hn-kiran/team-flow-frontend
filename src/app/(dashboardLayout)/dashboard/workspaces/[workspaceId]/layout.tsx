import type { ReactNode } from "react";

import { PageContainer } from "@/components/layout/page-container";
import { WorkspaceNavigation } from "@/components/layout/workspace-navigation";

interface WorkspaceLayoutProps {
  children: ReactNode;
  params: Promise<{
    workspaceId: string;
  }>;
}

export default async function WorkspaceLayout({
  children,
  params,
}: WorkspaceLayoutProps) {
  const { workspaceId } = await params;

  return (
    <div className="min-w-0">
      <WorkspaceNavigation workspaceId={workspaceId} />

      <PageContainer>{children}</PageContainer>
    </div>
  );
}
