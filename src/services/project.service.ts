import { apiClient } from "@/lib/axios/instance";
import { Project, ProjectListResponse } from "@/types/project.types";

const getWorkspaceProjects = async (
  workspaceId: string,
): Promise<Project[]> => {
  const response = await apiClient.get<ProjectListResponse>(
    `/projects/${workspaceId}/projects`,
  );

  return response.data.data;
};

const getProjectById = async (workspaceId: string, projectId: string) => {
  const response = await apiClient.get(
    `/projects/${workspaceId}/projects/${projectId}`,
  );

  return response.data;
};

const createProject = async (
  workspaceId: string,
  payload: {
    name: string;
    description?: string;
  },
) => {
  const response = await apiClient.post(
    `/projects/${workspaceId}/projects`,
    payload,
  );

  return response.data;
};

const updateProject = async (
  workspaceId: string,
  projectId: string,
  payload: {
    name?: string;
    description?: string;
  },
) => {
  const response = await apiClient.patch(
    `/projects/${workspaceId}/projects/${projectId}`,
    payload,
  );

  return response.data;
};

const deleteProject = async (workspaceId: string, projectId: string) => {
  const response = await apiClient.patch(
    `/projects/${workspaceId}/projects/${projectId}/delete`,
  );

  return response.data;
};

export const projectService = {
  getWorkspaceProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
