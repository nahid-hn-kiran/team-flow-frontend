"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  FolderKanban,
  ListTodo,
  Loader2,
  Plus,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useAuth } from "@/providers/auth-provider";
import { workspaceService } from "@/services/workspace.service";
import { projectService } from "@/services/project.service";
import { taskService } from "@/services/task.service";

import type { WorkspaceMembership } from "@/types/workspace.types";
import type { Project } from "@/types/project.types";
import type { Task } from "@/types/task.types";

interface DashboardProject extends Project {
  workspaceName: string;
}

interface DashboardTask extends Task {
  workspaceName: string;
  projectName: string;
}

interface WorkspaceWithData extends WorkspaceMembership {
  projects: Project[];
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

const getStatusIcon = (status: Task["status"]) => {
  switch (status) {
    case "COMPLETED":
      return <CheckCircle2 className="size-4" />;

    case "IN_PROGRESS":
      return <Clock3 className="size-4" />;

    default:
      return <ListTodo className="size-4" />;
  }
};

export default function DashboardPage() {
  const { user } = useAuth();

  const [workspaces, setWorkspaces] = useState<WorkspaceWithData[]>([]);

  const [allTasks, setAllTasks] = useState<DashboardTask[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const memberships = await workspaceService.getMyWorkspaces();

        if (!isMounted) {
          return;
        }

        if (!Array.isArray(memberships)) {
          throw new Error("Unable to load workspaces.");
        }

        const workspaceResults = await Promise.all(
          memberships.map(async (membership) => {
            const workspaceId = membership.workspace.id;

            try {
              const projects =
                await projectService.getWorkspaceProjects(workspaceId);

              return {
                ...membership,
                projects: Array.isArray(projects) ? projects : [],
              };
            } catch (error) {
              console.error(
                `Unable to load projects for workspace ${workspaceId}:`,
                error,
              );

              return {
                ...membership,
                projects: [],
              };
            }
          }),
        );

        if (!isMounted) {
          return;
        }

        setWorkspaces(workspaceResults);

        const taskResults = await Promise.all(
          workspaceResults.flatMap((workspace) =>
            workspace.projects.map(async (project) => {
              try {
                const response = await taskService.getProjectTasks(
                  workspace.workspace.id,
                  project.id,
                );

                const tasks = Array.isArray(response?.data)
                  ? response.data
                  : [];

                return tasks.map((task: Task) => ({
                  ...task,
                  workspaceName: workspace.workspace.name,
                  projectName: project.name,
                }));
              } catch (error) {
                console.error(
                  `Unable to load tasks for project ${project.id}:`,
                  error,
                );

                return [];
              }
            }),
          ),
        );

        if (!isMounted) {
          return;
        }

        setAllTasks(taskResults.flat());
      } catch (error) {
        console.error("Dashboard loading error:", error);

        if (!isMounted) {
          return;
        }

        const message =
          error instanceof Error ? error.message : "Unable to load dashboard.";

        setError(message);

        toast.error(message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const totalTasks = allTasks.length;

    const completedTasks = allTasks.filter(
      (task) => task.status === "COMPLETED",
    ).length;

    const inProgressTasks = allTasks.filter(
      (task) => task.status === "IN_PROGRESS",
    ).length;

    const todoTasks = allTasks.filter((task) => task.status === "TODO").length;

    const totalProjects = workspaces.reduce(
      (total, workspace) => total + workspace.projects.length,
      0,
    );

    return {
      workspaces: workspaces.length,
      projects: totalProjects,
      tasks: totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
    };
  }, [workspaces, allTasks]);

  const recentProjects = useMemo<DashboardProject[]>(() => {
    return workspaces
      .flatMap((workspace) =>
        workspace.projects.map((project) => ({
          ...project,
          workspaceName: workspace.workspace.name,
        })),
      )
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      )
      .slice(0, 5);
  }, [workspaces]);

  const myTasks = useMemo(() => {
    if (!user) {
      return [];
    }

    return allTasks
      .filter((task) => {
        return task.assignee?.id === user.id || task.assigneeId === user.id;
      })
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      )
      .slice(0, 6);
  }, [allTasks, user]);

  const recentTasks = useMemo(() => {
    return [...allTasks]
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      )
      .slice(0, 5);
  }, [allTasks]);

  const firstName = user?.name?.trim().split(/\s+/)[0] || "there";

  if (isLoading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <Loader2 className="size-7 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Workspace management
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            Dashboard
          </h1>
        </div>

        <Card>
          <CardContent className="flex min-h-[300px] flex-col items-center justify-center text-center">
            <div className="flex size-12 items-center justify-center rounded-xl bg-muted">
              <BriefcaseBusiness className="size-6 text-muted-foreground" />
            </div>

            <h2 className="mt-4 font-semibold">Unable to load dashboard</h2>

            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              {error}
            </p>

            <Button className="mt-5" onClick={() => window.location.reload()}>
              Try again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Workspace management
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Good morning, {firstName}
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Here&apos;s what&apos;s happening across your workspaces.
          </p>
        </div>

        <Link
          href="/dashboard/workspaces"
          className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <BriefcaseBusiness className="size-4" />
          View workspaces
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Workspaces</p>

                <p className="mt-2 text-3xl font-semibold">
                  {stats.workspaces}
                </p>
              </div>

              <div className="flex size-11 items-center justify-center rounded-xl bg-muted">
                <BriefcaseBusiness className="size-5 text-muted-foreground" />
              </div>
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              Workspaces you belong to
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Projects</p>

                <p className="mt-2 text-3xl font-semibold">{stats.projects}</p>
              </div>

              <div className="flex size-11 items-center justify-center rounded-xl bg-muted">
                <FolderKanban className="size-5 text-muted-foreground" />
              </div>
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              Across all workspaces
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total tasks</p>

                <p className="mt-2 text-3xl font-semibold">{stats.tasks}</p>
              </div>

              <div className="flex size-11 items-center justify-center rounded-xl bg-muted">
                <ListTodo className="size-5 text-muted-foreground" />
              </div>
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              {stats.todoTasks} to do · {stats.inProgressTasks} in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>

                <p className="mt-2 text-3xl font-semibold">
                  {stats.completedTasks}
                </p>
              </div>

              <div className="flex size-11 items-center justify-center rounded-xl bg-muted">
                <CheckCircle2 className="size-5 text-muted-foreground" />
              </div>
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              {stats.tasks > 0
                ? `${Math.round(
                    (stats.completedTasks / stats.tasks) * 100,
                  )}% of all tasks`
                : "No tasks yet"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main content */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* Recent projects */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Recent projects</CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                Projects that were updated recently.
              </p>
            </div>

            <Button variant="ghost" size="sm">
              <Link href="/dashboard/workspaces">
                View all
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardHeader>

          <CardContent>
            {recentProjects.length === 0 ? (
              <div className="flex min-h-[220px] flex-col items-center justify-center text-center">
                <div className="flex size-11 items-center justify-center rounded-xl bg-muted">
                  <FolderKanban className="size-5 text-muted-foreground" />
                </div>

                <p className="mt-4 font-medium">No projects yet</p>

                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Create a project inside one of your workspaces to start
                  organizing your work.
                </p>

                <Button className="mt-4" variant="outline">
                  <Link href="/dashboard/workspaces">
                    <Plus className="size-4" />
                    Create a project
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="divide-y">
                {recentProjects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/dashboard/workspaces/${project.workspaceId}/projects/${project.id}`}
                    className="flex items-center gap-4 py-4 transition-colors first:pt-0 last:pb-0 hover:bg-muted/40"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <FolderKanban className="size-4 text-muted-foreground" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {project.name}
                      </p>

                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {project.workspaceName}
                      </p>
                    </div>

                    <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* My tasks */}
        <Card>
          <CardHeader>
            <CardTitle>My tasks</CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              Tasks assigned to you.
            </p>
          </CardHeader>

          <CardContent>
            {myTasks.length === 0 ? (
              <div className="flex min-h-[220px] flex-col items-center justify-center text-center">
                <div className="flex size-11 items-center justify-center rounded-xl bg-muted">
                  <CheckCircle2 className="size-5 text-muted-foreground" />
                </div>

                <p className="mt-4 font-medium">Nothing assigned to you</p>

                <p className="mt-1 text-sm text-muted-foreground">
                  You&apos;re all caught up.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {myTasks.map((task) => (
                  <Link
                    key={task.id}
                    href={`/dashboard/workspaces/${task.workspaceId}/projects/${task.projectId}/tasks/${task.id}`}
                    className="block rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
                        {getStatusIcon(task.status)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="truncate text-sm font-medium">
                            {task.title}
                          </p>

                          <Badge
                            variant="secondary"
                            className="shrink-0 text-[10px]"
                          >
                            {getPriorityLabel(task.priority)}
                          </Badge>
                        </div>

                        <p className="mt-1 truncate text-xs text-muted-foreground">
                          {task.projectName}
                        </p>

                        <p className="mt-2 text-xs text-muted-foreground">
                          {getStatusLabel(task.status)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent task activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Recent work</CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              Recently updated tasks across your workspaces.
            </p>
          </div>
        </CardHeader>

        <CardContent>
          {recentTasks.length === 0 ? (
            <div className="flex min-h-[180px] items-center justify-center text-center">
              <div>
                <p className="font-medium">No task activity yet</p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Task activity will appear here once your team starts working.
                </p>
              </div>
            </div>
          ) : (
            <div className="divide-y">
              {recentTasks.map((task) => (
                <Link
                  key={task.id}
                  href={`/dashboard/workspaces/${task.workspaceId}/projects/${task.projectId}/tasks/${task.id}`}
                  className="flex items-center gap-4 py-4 transition-colors hover:bg-muted/40"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                    {getStatusIcon(task.status)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{task.title}</p>

                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {task.workspaceName} · {task.projectName}
                    </p>
                  </div>

                  <div className="hidden text-right sm:block">
                    <p className="text-xs font-medium">
                      {getStatusLabel(task.status)}
                    </p>

                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {new Date(task.updatedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Workspace overview */}
      {workspaces.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your workspaces</CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              A quick overview of the workspaces you belong to.
            </p>
          </CardHeader>

          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {workspaces.map((membership) => (
                <Link
                  key={membership.workspace.id}
                  href={`/dashboard/workspaces/${membership.workspace.id}`}
                  className="rounded-xl border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <BriefcaseBusiness className="size-4 text-muted-foreground" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {membership.workspace.name}
                      </p>

                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                        {membership.workspace.description ||
                          "No description provided."}
                      </p>

                      <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <FolderKanban className="size-3.5" />
                          {membership.projects.length}
                        </span>

                        <Badge variant="outline" className="text-[10px]">
                          {membership.role}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
