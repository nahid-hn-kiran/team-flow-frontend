export interface IWorkspace {
  id: string;
  name: string;
  description: string | null;
}

export interface ICreateWorkspacePayload {
  name: string;
  description?: string;
}

export interface IWorkspacesResponse {
  success: boolean;
  message?: string;
  data: IWorkspace[];
}

export interface Workspace {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceMembership {
  id: string;
  workspaceId: string;
  userId: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  workspace: Workspace;
}

export interface WorkspaceListResponse {
  success: boolean;
  message: string;
  data: WorkspaceMembership[];
}
