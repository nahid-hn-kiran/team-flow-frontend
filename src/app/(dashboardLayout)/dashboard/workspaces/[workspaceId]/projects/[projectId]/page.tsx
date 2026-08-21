/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock3,
  FolderKanban,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { projectService } from "@/services/project.service";
import { taskService } from "@/services/task.service";

import type { Task, TaskListResponse } from "@/types/task.types";

import { CreateTaskDialog } from "./create-task-dialog";

interface Project {
  id: string;
  name: string;
  description: string | null;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
}

const getStatusLabel = (status: Task["status"]) => {
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

const getStatusIcon = (status: Task["status"]) => {
  switch (status) {
    case "TODO":
      return <Circle className="size-4" />;

    case "IN_PROGRESS":
      return <Clock3 className="size-4" />;

    case "COMPLETED":
      return <CheckCircle2 className="size-4" />;

    default:
      return <Circle className="size-4" />;
  }
};

export default function ProjectPage() {
  const params = useParams<{
    workspaceId: string;
    projectId: string;
  }>();

  const workspaceId = params.workspaceId;
  const projectId = params.projectId;

  const [project, setProject] = useState<Project | null>(null);

  const [tasks, setTasks] = useState<TaskListResponse | null>(null);

  const [isProjectLoading, setIsProjectLoading] = useState(true);

  const [isTasksLoading, setIsTasksLoading] = useState(true);

  const [projectError, setProjectError] = useState<string | null>(null);

  const [tasksError, setTasksError] = useState<string | null>(null);

  const loadTasks = async () => {
    if (!workspaceId || !projectId) {
      return;
    }

    try {
      setIsTasksLoading(true);
      setTasksError(null);

      const data = await taskService.getProjectTasks(workspaceId, projectId);

      setTasks(data);
    } catch (error) {
      console.error("Get tasks error:", error);

      setTasksError(
        error instanceof Error ? error.message : "Unable to load tasks.",
      );
    } finally {
      setIsTasksLoading(false);
    }
  };

  useEffect(() => {
    if (!workspaceId || !projectId) {
      return;
    }

    const loadProject = async () => {
      try {
        setIsProjectLoading(true);
        setProjectError(null);

        const response = await projectService.getProjectById(
          workspaceId,
          projectId,
        );

        if (!response?.success) {
          throw new Error(response?.message || "Unable to load project.");
        }

        setProject(response.data);
      } catch (error) {
        console.error("Get project error:", error);

        setProjectError(
          error instanceof Error ? error.message : "Unable to load project.",
        );
      } finally {
        setIsProjectLoading(false);
      }
    };

    loadProject();
    loadTasks();
  }, [workspaceId, projectId]);

  if (isProjectLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (projectError || !project) {
    return (
      <div className="space-y-5">
        <Button variant="ghost">
          <Link href={`/workspaces/${workspaceId}`}>
            <ArrowLeft className="size-4" />
            Back to workspace
          </Link>
        </Button>

        <Card>
          <CardContent className="flex min-h-[250px] items-center justify-center text-center">
            <div>
              <p className="font-medium">Unable to load project</p>

              <p className="mt-2 text-sm text-muted-foreground">
                {projectError || "Project not found."}
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
      <Button variant="ghost">
        <Link href={`/workspaces/${workspaceId}`}>
          <ArrowLeft className="size-4" />
          Back to workspace
        </Link>
      </Button>

      {/* Project header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-muted">
                <FolderKanban className="size-6 text-muted-foreground" />
              </div>

              <div className="min-w-0">
                <h1 className="text-2xl font-semibold tracking-tight">
                  {project.name}
                </h1>

                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                  {project.description || "No description provided."}
                </p>
              </div>
            </div>

            <CreateTaskDialog
              workspaceId={workspaceId}
              projectId={projectId}
              onCreated={loadTasks}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tasks */}
      <section className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Tasks</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage the work that needs to be completed for this project.
            </p>
          </div>

          <CreateTaskDialog
            workspaceId={workspaceId}
            projectId={projectId}
            onCreated={loadTasks}
          />
        </div>
        {/* Loading */}
        {isTasksLoading && (
          <Card>
            <CardContent className="flex min-h-[220px] items-center justify-center">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        )}
        {/* Error */}
        {!isTasksLoading && tasksError && (
          <Card>
            <CardContent className="flex min-h-[220px] flex-col items-center justify-center text-center">
              <p className="font-medium">Unable to load tasks</p>

              <p className="mt-2 text-sm text-muted-foreground">{tasksError}</p>

              <Button variant="outline" className="mt-4" onClick={loadTasks}>
                Try again
              </Button>
            </CardContent>
          </Card>
        )}
        {/* Empty */}
        {!isTasksLoading && !tasksError && tasks?.data.length === 0 && (
          <Card>
            <CardContent className="flex min-h-[280px] flex-col items-center justify-center text-center">
              <div className="flex size-12 items-center justify-center rounded-xl bg-muted">
                <CheckCircle2 className="size-6 text-muted-foreground" />
              </div>

              <h3 className="mt-4 font-semibold">No tasks yet</h3>

              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Create your first task to start working on this project.
              </p>

              <div className="mt-5">
                <CreateTaskDialog
                  workspaceId={workspaceId}
                  projectId={projectId}
                  onCreated={loadTasks}
                />
              </div>
            </CardContent>
          </Card>
        )}
        {/* Task list */}
        {!isTasksLoading && !tasksError && (tasks?.data?.length ?? 0) > 0 && (
          <div className="space-y-3">
            {tasks?.data.map((task) => (
              <Link
                key={task.id}
                href={`/dashboard/workspaces/${workspaceId}/projects/${projectId}/tasks/${task.id}`}
                className="group block"
              >
                <Card className="transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                        {getStatusIcon(task.status)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate font-medium">{task.title}</h3>

                          <Badge variant="secondary" className="shrink-0">
                            {getStatusLabel(task.status)}
                          </Badge>
                        </div>

                        <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                          {task.description || "No description provided."}
                        </p>
                      </div>

                      <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
