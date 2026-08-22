import { WorkspaceActivity } from "@/components/modules/workspace/workspace-activity";

interface WorkspaceActivityPageProps {
  params: Promise<{
    workspaceId: string;
  }>;
}

export default async function WorkspaceActivityPage({
  params,
}: WorkspaceActivityPageProps) {
  const { workspaceId } = await params;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-muted-foreground">Workspace</p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Activity</h1>

        <p className="mt-2 text-sm text-muted-foreground">
          See what has been happening in this workspace.
        </p>
      </div>

      <WorkspaceActivity workspaceId={workspaceId} />
    </div>
  );
}
