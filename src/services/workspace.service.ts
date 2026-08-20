import { apiClient } from "@/lib/axios/instance";
import {
  WorkspaceListResponse,
  WorkspaceMembership,
} from "@/types/workspace.types";

const getMyWorkspaces = async (): Promise<WorkspaceMembership[]> => {
  const response = await apiClient.get<WorkspaceListResponse>("/workspaces");

  return response.data.data;
};

const getWorkspaceById = async (workspaceId: string) => {
  const response = await apiClient.get(`/workspaces/${workspaceId}`);

  return response.data;
};

const createWorkspace = async (payload: {
  name: string;
  description?: string;
}) => {
  const response = await apiClient.post("/workspaces", payload);

  return response.data;
};

const getWorkspaceMembers = async (workspaceId: string) => {
  const response = await apiClient.get(`/workspaces/${workspaceId}/members`);

  return response.data;
};

export const workspaceService = {
  getMyWorkspaces,
  getWorkspaceById,
  createWorkspace,
  getWorkspaceMembers,
};
