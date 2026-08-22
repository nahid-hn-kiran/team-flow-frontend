import { apiClient } from "@/lib/axios/instance";

const getProjectTasks = async (workspaceId: string, projectId: string) => {
  const response = await apiClient.get(
    `/tasks/${workspaceId}/projects/${projectId}/tasks`,
  );

  return response.data;
};

const createTask = async (
  workspaceId: string,
  projectId: string,
  payload: {
    title: string;
    description?: string;
    priority?: string;
  },
) => {
  const response = await apiClient.post(
    `/tasks/${workspaceId}/projects/${projectId}/tasks`,
    payload,
  );

  return response.data;
};

const getTaskById = async (
  workspaceId: string,
  projectId: string,
  taskId: string,
) => {
  const response = await apiClient.get(
    `/tasks/${workspaceId}/projects/${projectId}/tasks/${taskId}`,
  );

  return response.data;
};

const updateTask = async (
  workspaceId: string,
  projectId: string,
  taskId: string,
  payload: {
    title?: string;
    description?: string;
    priority?: string;
  },
) => {
  const response = await apiClient.patch(
    `/tasks/${workspaceId}/projects/${projectId}/tasks/${taskId}`,
    payload,
  );

  return response.data;
};

const updateTaskStatus = async (
  workspaceId: string,
  projectId: string,
  taskId: string,
  status: string,
) => {
  const response = await apiClient.patch(
    `/tasks/${workspaceId}/projects/${projectId}/tasks/${taskId}/status`,
    {
      status,
    },
  );

  return response.data;
};

const assignTask = async (
  workspaceId: string,
  projectId: string,
  task_id: string,
  assignedTo: string,
) => {
  const response = await apiClient.patch(
    `/tasks/${workspaceId}/projects/${projectId}/tasks/${task_id}/assign`,
    {
      assignedTo,
    },
  );

  return response.data;
};

const deleteTask = async (
  workspaceId: string,
  projectId: string,
  taskId: string,
) => {
  const response = await apiClient.patch(
    `/tasks/${workspaceId}/projects/${projectId}/tasks/${taskId}/delete`,
  );

  return response.data;
};

export const taskService = {
  getProjectTasks,
  createTask,
  getTaskById,
  updateTask,
  updateTaskStatus,
  assignTask,
  deleteTask,
};
