import { apiClient } from "@/lib/axios/instance";

const getTaskComments = async (
  workspaceId: string,
  projectId: string,
  taskId: string,
) => {
  const response = await apiClient.get(
    `/comments/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/comments`,
  );

  return response.data;
};

const createComment = async (
  workspaceId: string,
  projectId: string,
  taskId: string,
  content: string,
) => {
  const response = await apiClient.post(
    `/comments/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/comments`,
    {
      content,
    },
  );

  return response.data;
};

const updateComment = async (
  workspaceId: string,
  projectId: string,
  taskId: string,
  commentId: string,
  content: string,
) => {
  const response = await apiClient.patch(
    `/comments/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/comments/${commentId}`,
    {
      content,
    },
  );

  return response.data;
};

const deleteComment = async (
  workspaceId: string,
  projectId: string,
  taskId: string,
  commentId: string,
) => {
  const response = await apiClient.patch(
    `/comments/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/comments/${commentId}/delete`,
  );

  return response.data;
};

export const commentService = {
  getTaskComments,
  createComment,
  updateComment,
  deleteComment,
};
