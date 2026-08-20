"use client";

import { WorkspaceActivity } from "@/components/modules/workspace/workspace-activity";
import { useParams } from "next/navigation";

export default function WorkspaceActivityPage() {
  const params = useParams();

  const workspaceId = params.workspaceId as string;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-muted-foreground">Workspace</p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Activity</h1>

        <p className="mt-2 text-sm text-muted-foreground">
          See what has been happening in this workspace.
        </p>
      </div>

      <WorkspaceActivity workspaceId={workspaceId} />
    </div>
  );
}
