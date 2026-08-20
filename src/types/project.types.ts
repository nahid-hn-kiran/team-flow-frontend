export interface Project {
  id: string;
  name: string;
  description: string | null;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectListResponse {
  success: boolean;
  message: string;
  data: Project[];
}
