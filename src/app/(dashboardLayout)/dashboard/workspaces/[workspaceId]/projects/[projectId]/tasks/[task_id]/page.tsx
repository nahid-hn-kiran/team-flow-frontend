/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock3,
  Loader2,
  MoreHorizontal,
  Trash2,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { taskService } from "@/services/task.service";

import type { Task, TaskStatus } from "@/types/task.types";

import { EditTaskDialog } from "@/components/modules/tasks/edit-task-dialog";
import { AssignTaskDialog } from "@/components/modules/tasks/assign-task-dialog";
import { TaskComments } from "@/components/modules/tasks/task-comments";
import { TaskActivity } from "@/components/modules/tasks/task-activity";

const statusOptions: TaskStatus[] = ["TODO", "IN_PROGRESS", "COMPLETED"];

const priorityOptions = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;

type TaskPriority = (typeof priorityOptions)[number];

const getStatusLabel = (status: TaskStatus) => {
  switch (status) {
    case "TODO":
      return "To do";

    case "IN_PROGRESS":
      return "In progress";

    case "COMPLETED":
      return "Completed";

    default:
      return status;
  }
};

const StatusIcon = ({ status }: { status: TaskStatus }) => {
  if (status === "COMPLETED") {
    return <CheckCircle2 className="size-4" />;
  }

  if (status === "IN_PROGRESS") {
    return <Clock3 className="size-4" />;
  }

  return <Circle className="size-4" />;
};

const getPriorityLabel = (priority: string) => {
  switch (priority) {
    case "LOW":
      return "Low";

    case "MEDIUM":
      return "Medium";

    case "HIGH":
      return "High";

    case "URGENT":
      return "Urgent";

    default:
      return priority;
  }
};

export default function TaskPage() {
  const params = useParams<{
    workspaceId: string;
    projectId: string;
    task_id: string;
  }>();

  const router = useRouter();

  const workspaceId = params.workspaceId;
  const projectId = params.projectId;
  const taskId = params.task_id;

  const [task, setTask] = useState<Task | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingPriority, setIsUpdatingPriority] = useState(false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!workspaceId || !projectId || !taskId) {
      return;
    }

    const loadTask = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await taskService.getTaskById(
          workspaceId,
          projectId,
          taskId,
        );

        if (!response?.success) {
          throw new Error(response?.message || "Unable to load task.");
        }

        setTask(response.data);
      } catch (error) {
        console.error("Get task error:", error);

        setError(
          error instanceof Error ? error.message : "Unable to load task.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadTask();
  }, [workspaceId, projectId, taskId]);

  const handleStatusChange = async (status: TaskStatus) => {
    if (!task || task.status === status) {
      return;
    }

    try {
      setIsUpdating(true);

      const response = await taskService.updateTaskStatus(
        workspaceId,
        projectId,
        taskId,
        status,
      );

      if (!response?.success) {
        throw new Error(response?.message || "Unable to update task status.");
      }

      setTask((currentTask) => {
        if (!currentTask) {
          return currentTask;
        }

        return {
          ...currentTask,
          status,
          updatedAt: new Date().toISOString(),
        };
      });

      toast.success("Task status updated.");
    } catch (error) {
      console.error("Update task status error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to update task status.",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePriorityChange = async (priority: TaskPriority) => {
    if (!task || task.priority === priority) {
      return;
    }

    try {
      setIsUpdatingPriority(true);

      const response = await taskService.updateTask(
        workspaceId,
        projectId,
        taskId,
        {
          priority,
        },
      );

      if (!response?.success) {
        throw new Error(response?.message || "Unable to update task priority.");
      }

      setTask((currentTask) => {
        if (!currentTask) {
          return currentTask;
        }

        return {
          ...currentTask,
          priority,
          updatedAt: new Date().toISOString(),
        };
      });

      toast.success("Task priority updated.");
    } catch (error) {
      console.error("Update task priority error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to update task priority.",
      );
    } finally {
      setIsUpdatingPriority(false);
    }
  };

  const handleDelete = async () => {
    if (!task) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this task?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setIsDeleting(true);

      const response = await taskService.deleteTask(
        workspaceId,
        projectId,
        taskId,
      );

      if (!response?.success) {
        throw new Error(response?.message || "Unable to delete task.");
      }

      toast.success("Task deleted.");

      router.push(`/dashboard/workspaces/${workspaceId}/projects/${projectId}`);
    } catch (error) {
      console.error("Delete task error:", error);

      toast.error(
        error instanceof Error ? error.message : "Unable to delete task.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={() =>
            router.push(
              `/dashboard/workspaces/${workspaceId}/projects/${projectId}`,
            )
          }
        >
          <ArrowLeft className="size-4" />
          Back to project
        </Button>

        <Card>
          <CardContent className="flex min-h-[250px] items-center justify-center text-center">
            <div>
              <p className="font-medium">Unable to load task</p>

              <p className="mt-2 text-sm text-muted-foreground">
                {error || "Task not found."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back */}
      <Button
        variant="ghost"
        onClick={() =>
          router.push(
            `/dashboard/workspaces/${workspaceId}/projects/${projectId}`,
          )
        }
      >
        <ArrowLeft className="size-4" />
        Back to project
      </Button>

      {/* Task header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-5">
            <div className="flex min-w-0 gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted">
                <StatusIcon status={task.status} />
              </div>

              <div className="min-w-0">
                <h1 className="text-2xl font-semibold tracking-tight">
                  {task.title}
                </h1>

                <p className="mt-2 text-sm text-muted-foreground">
                  {task.description || "No description provided."}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <EditTaskDialog
                workspaceId={workspaceId}
                projectId={projectId}
                taskId={taskId}
                title={task.title}
                description={task.description}
                onUpdated={(updatedTask) => {
                  setTask((currentTask) => {
                    if (!currentTask) {
                      return currentTask;
                    }

                    return {
                      ...currentTask,
                      title: updatedTask.title,
                      description: updatedTask.description,
                      updatedAt: new Date().toISOString(),
                    };
                  });
                }}
              />

              <DropdownMenu>
                <DropdownMenuTrigger
                  type="button"
                  className="inline-flex size-9 items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  disabled={isDeleting}
                  aria-label="Task actions"
                >
                  <MoreHorizontal className="size-5" />
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    <Trash2 className="size-4" />
                    Delete task
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        {/* Main */}
        <div className="space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>

            <CardContent>
              <p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
                {task.description ||
                  "This task does not have a description yet."}
              </p>
            </CardContent>
          </Card>

          {/* Comments */}
          <TaskComments
            workspaceId={workspaceId}
            projectId={projectId}
            taskId={taskId}
          />

          {/* Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
            </CardHeader>

            <CardContent>
              <TaskActivity workspaceId={workspaceId} taskId={taskId} />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Status</CardTitle>
            </CardHeader>

            <CardContent className="space-y-2">
              {statusOptions.map((status) => {
                const isActive = task.status === status;

                return (
                  <Button
                    key={status}
                    variant={isActive ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    disabled={isUpdating}
                    onClick={() => handleStatusChange(status)}
                  >
                    <StatusIcon status={status} />

                    {getStatusLabel(status)}
                  </Button>
                );
              })}
            </CardContent>
          </Card>

          {/* Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Details</CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* Priority */}
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Priority
                </p>

                <DropdownMenu>
                  <DropdownMenuTrigger
                    type="button"
                    className="mt-2 inline-flex h-auto items-center rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    disabled={isUpdatingPriority}
                  >
                    <Badge variant="secondary" className="cursor-pointer">
                      {getPriorityLabel(task.priority)}
                    </Badge>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="start">
                    {priorityOptions.map((priority) => (
                      <DropdownMenuItem
                        key={priority}
                        onClick={() => handlePriorityChange(priority)}
                        disabled={
                          isUpdatingPriority || task.priority === priority
                        }
                      >
                        {getPriorityLabel(priority)}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Assignee */}
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Assignee
                </p>

                <div className="mt-3">
                  <div className="mb-3 flex items-center gap-2">
                    <UserRound className="size-4 text-muted-foreground" />

                    <span className="text-sm">
                      {task.assignee?.name || "Unassigned"}
                    </span>
                  </div>

                  <AssignTaskDialog
                    workspaceId={workspaceId}
                    projectId={projectId}
                    taskId={taskId}
                    currentAssigneeId={task.assignee?.id ?? null}
                    currentAssigneeName={task.assignee?.name ?? null}
                    onAssigned={(member) => {
                      setTask((currentTask) => {
                        if (!currentTask) {
                          return currentTask;
                        }

                        return {
                          ...currentTask,
                          assignee: {
                            id: member.user.id,
                            name: member.user.name,
                            email: member.user.email,
                          },
                          assigneeId: member.user.id,
                          updatedAt: new Date().toISOString(),
                        };
                      });
                    }}
                  />
                </div>
              </div>

              {/* Created */}
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Created
                </p>

                <p className="mt-2 text-sm">
                  {new Date(task.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Updated */}
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Updated
                </p>

                <p className="mt-2 text-sm">
                  {new Date(task.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
