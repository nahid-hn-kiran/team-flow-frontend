export type TaskStatus = "TODO" | "IN_PROGRESS" | "COMPLETED";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  workspaceId: string;
  projectId: string;
  assigneeId: string | null;
  createdAt: string;
  updatedAt: string;

  assignee?: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export interface TaskListResponse {
  success: boolean;
  message: string;
  data: Task[];
}
