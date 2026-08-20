export interface Activity {
  id: string;
  action: string;
  description?: string | null;
  createdAt: string;

  userId?: string | null;

  performer?: {
    id: string;
    name: string;
    email?: string;
  } | null;

  workspaceId?: string;
  taskId?: string | null;
  projectId?: string | null;
}
