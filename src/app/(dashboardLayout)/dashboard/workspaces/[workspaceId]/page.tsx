/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight, FolderKanban } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { AppBreadcrumbs } from "@/components/layout/app-breadcrumbs";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/components/ui/page-state";

import { workspaceService } from "@/services/workspace.service";
import { projectService } from "@/services/project.service";

import { CreateProjectDialog } from "./projects/create-project-dialog";
import { Project } from "@/types/project.types";
import { EditWorkspaceDialog } from "@/components/modules/workspace/edit-workspace-dialog";
import { DeleteWorkspaceButton } from "@/components/modules/workspace/delete-workspace-button";

interface Workspace {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function WorkspacePage() {
  const params = useParams<{ workspaceId: string }>();
  const router = useRouter();

  const workspaceId = params.workspaceId;

  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isProjectsLoading, setIsProjectsLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [projectsError, setProjectsError] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    if (!workspaceId) return;

    try {
      setIsProjectsLoading(true);
      setProjectsError(null);

      const data = await projectService.getWorkspaceProjects(workspaceId);

      setProjects(data);
    } catch (error) {
      console.error("Get projects error:", error);

      setProjectsError(
        error instanceof Error ? error.message : "Unable to load projects.",
      );
    } finally {
      setIsProjectsLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    if (!workspaceId) return;

    const loadWorkspace = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await workspaceService.getWorkspaceById(workspaceId);

        if (!response?.success) {
          throw new Error(response?.message || "Unable to load workspace.");
        }

        setWorkspace(response.data);
      } catch (error) {
        console.error("Get workspace error:", error);

        setError(
          error instanceof Error ? error.message : "Unable to load workspace.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadWorkspace();
    loadProjects();
  }, [workspaceId, loadProjects]);

  /* Workspace loading */
  if (isLoading) {
    return <LoadingState message="Loading workspace..." />;
  }

  /* Workspace error */
  if (error || !workspace) {
    return (
      <ErrorState
        title="Unable to load workspace"
        message={error || "Workspace not found."}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumbs */}
      <AppBreadcrumbs workspaceName={workspace.name} />

      {/* Workspace header */}
      {/* Workspace header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-muted">
                <FolderKanban className="size-6 text-muted-foreground" />
              </div>

              <div className="min-w-0">
                <h1 className="text-2xl font-semibold tracking-tight">
                  {workspace.name}
                </h1>

                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                  {workspace.description || "No description provided."}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <EditWorkspaceDialog
                workspaceId={workspace.id}
                name={workspace.name}
                description={workspace.description}
                onUpdated={async () => {
                  const response = await workspaceService.getWorkspaceById(
                    workspace.id,
                  );

                  if (response?.success) {
                    setWorkspace(response.data);
                  }
                }}
              />

              <DeleteWorkspaceButton
                workspaceId={workspace.id}
                workspaceName={workspace.name}
                onDeleted={() => {
                  router.push("/dashboard/workspaces");
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects */}
      <section className="space-y-5">
        {/* Section header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold">Projects</h2>

              {!isProjectsLoading && !projectsError && (
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                  {projects.length}
                </span>
              )}
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              Projects inside this workspace.
            </p>
          </div>

          <CreateProjectDialog
            workspaceId={workspaceId}
            onCreated={loadProjects}
          />
        </div>

        {/* Loading */}
        {isProjectsLoading && <LoadingState message="Loading projects..." />}

        {/* Error */}
        {!isProjectsLoading && projectsError && (
          <ErrorState
            title="Unable to load projects"
            message={projectsError}
            onRetry={loadProjects}
          />
        )}

        {/* Empty */}
        {!isProjectsLoading && !projectsError && projects.length === 0 && (
          <EmptyState
            title="No projects yet"
            description="Create your first project inside this workspace to start organizing your work."
            action={
              <CreateProjectDialog
                workspaceId={workspaceId}
                onCreated={loadProjects}
              />
            }
          />
        )}

        {/* Projects */}
        {!isProjectsLoading && !projectsError && projects.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/dashboard/workspaces/${workspaceId}/projects/${project.id}`}
                className="group"
              >
                <Card className="h-full transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                          <FolderKanban className="size-5 text-muted-foreground" />
                        </div>

                        <CardTitle className="truncate">
                          {project.name}
                        </CardTitle>
                      </div>

                      <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardHeader>

                  <CardContent>
                    <p className="line-clamp-3 text-sm text-muted-foreground">
                      {project.description || "No description provided."}
                    </p>
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
