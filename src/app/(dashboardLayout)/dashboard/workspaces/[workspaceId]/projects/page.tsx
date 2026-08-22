/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight, FolderKanban } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/components/ui/page-state";

import { AppBreadcrumbs } from "@/components/layout/app-breadcrumbs";

import { projectService } from "@/services/project.service";

import { Project } from "@/types/project.types";

import { CreateProjectDialog } from "./create-project-dialog";

export default function ProjectsPage() {
  const params = useParams<{
    workspaceId: string;
  }>();

  const workspaceId = params.workspaceId;

  const [projects, setProjects] = useState<Project[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    if (!workspaceId) return;

    try {
      setIsLoading(true);
      setError(null);

      const data = await projectService.getWorkspaceProjects(workspaceId);

      setProjects(data);
    } catch (error) {
      console.error("Get projects error:", error);

      setError(
        error instanceof Error ? error.message : "Unable to load projects.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  if (isLoading) {
    return <LoadingState message="Loading projects..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Unable to load projects"
        message={error}
        onRetry={loadProjects}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <AppBreadcrumbs />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight">Projects</h1>

            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              {projects.length}
            </span>
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            Manage all projects inside this workspace.
          </p>
        </div>

        <CreateProjectDialog
          workspaceId={workspaceId}
          onCreated={loadProjects}
        />
      </div>

      {/* Empty */}
      {projects.length === 0 && (
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
      {projects.length > 0 && (
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

                      <CardTitle className="truncate">{project.name}</CardTitle>
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
    </div>
  );
}
