"use client";

import { WorkspaceMembers } from "@/components/modules/workspace/workspace-members";
import { useParams } from "next/navigation";

export default function WorkspaceMembersPage() {
  const params = useParams();

  const workspaceId = params.workspaceId as string;

  return <WorkspaceMembers workspaceId={workspaceId} />;
}
