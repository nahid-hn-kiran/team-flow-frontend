import { apiClient } from "@/lib/axios/instance";

const getWorkspaceActivities = async (workspaceId: string) => {
  const response = await apiClient.get(`/activities/${workspaceId}`);

  return response.data;
};

const getTaskActivities = async (workspaceId: string, taskId: string) => {
  const response = await apiClient.get(
    `/activities/${workspaceId}/tasks/${taskId}`,
  );

  return response.data;
};

export const activityService = {
  getWorkspaceActivities,
  getTaskActivities,
};
