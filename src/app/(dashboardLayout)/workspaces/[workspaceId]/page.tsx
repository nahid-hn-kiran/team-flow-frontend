/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ArrowRight, FolderKanban, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { workspaceService } from "@/services/workspace.service";

import { projectService } from "@/services/project.service";
import { CreateProjectDialog } from "./projects/create-project-dialog";
import { Project } from "@/types/project.types";

interface Workspace {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function WorkspacePage() {
  const params = useParams<{ workspaceId: string }>();

  const workspaceId = params.workspaceId;

  const [workspace, setWorkspace] = useState<Workspace | null>(null);

  const [projects, setProjects] = useState<Project[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isProjectsLoading, setIsProjectsLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [projectsError, setProjectsError] = useState<string | null>(null);

  const loadProjects = async () => {
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
  };

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
  }, [workspaceId]);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !workspace) {
    return (
      <div className="space-y-4">
        <Button variant="ghost">
          <Link href="/workspaces">
            <ArrowLeft className="size-4" />
            Back to workspaces
          </Link>
        </Button>

        <Card>
          <CardContent className="flex min-h-[250px] items-center justify-center text-center">
            <div>
              <p className="font-medium">Unable to load workspace</p>

              <p className="mt-2 text-sm text-muted-foreground">
                {error || "Workspace not found."}
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
        <Link href="/workspaces">
          <ArrowLeft className="size-4" />
          Back to workspaces
        </Link>
      </Button>

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
          </div>
        </CardContent>
      </Card>

      {/* Projects */}
      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Projects</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Projects inside this workspace.
            </p>
          </div>

          <CreateProjectDialog
            workspaceId={workspaceId}
            onCreated={loadProjects}
          />
        </div>

        {isProjectsLoading && (
          <Card>
            <CardContent className="flex min-h-[220px] items-center justify-center">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        )}

        {!isProjectsLoading && projectsError && (
          <Card>
            <CardContent className="flex min-h-[220px] flex-col items-center justify-center text-center">
              <p className="font-medium">Unable to load projects</p>

              <p className="mt-2 text-sm text-muted-foreground">
                {projectsError}
              </p>

              <Button variant="outline" className="mt-4" onClick={loadProjects}>
                Try again
              </Button>
            </CardContent>
          </Card>
        )}

        {!isProjectsLoading && !projectsError && projects.length === 0 && (
          <Card>
            <CardContent className="flex min-h-[280px] flex-col items-center justify-center text-center">
              <div className="flex size-12 items-center justify-center rounded-xl bg-muted">
                <FolderKanban className="size-6 text-muted-foreground" />
              </div>

              <h3 className="mt-4 font-semibold">No projects yet</h3>

              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Create your first project inside this workspace.
              </p>

              <div className="mt-5">
                <CreateProjectDialog
                  workspaceId={workspaceId}
                  onCreated={loadProjects}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {!isProjectsLoading && !projectsError && projects.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/workspaces/${workspaceId}/projects/${project.id}`}
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
