/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, FolderKanban, Loader2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import { workspaceService } from "@/services/workspace.service";
import { WorkspaceMembership } from "@/types/workspace.types";
import { CreateWorkspaceDialog } from "./create-workspace-dialog";

export default function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState<WorkspaceMembership[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadWorkspaces = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await workspaceService.getMyWorkspaces();

      console.log("WORKSPACES:", data);

      setWorkspaces(data);
    } catch (error) {
      console.error("Get workspaces error:", error);

      setError(
        error instanceof Error ? error.message : "Unable to load workspaces.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWorkspaces();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">TeamFlow</p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Your workspaces
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Select a workspace to manage its projects and tasks.
          </p>
        </div>

        <CreateWorkspaceDialog onCreated={loadWorkspaces} />
      </div>

      {/* Error */}
      {error && (
        <Card>
          <CardContent className="flex min-h-[250px] flex-col items-center justify-center text-center">
            <p className="font-medium">Unable to load workspaces</p>

            <p className="mt-2 text-sm text-muted-foreground">{error}</p>

            <button
              type="button"
              onClick={loadWorkspaces}
              className="mt-4 text-sm font-medium underline underline-offset-4"
            >
              Try again
            </button>
          </CardContent>
        </Card>
      )}

      {/* Empty */}
      {!error && workspaces.length === 0 && (
        <Card>
          <CardContent className="flex min-h-[300px] flex-col items-center justify-center text-center">
            <div className="flex size-12 items-center justify-center rounded-xl bg-muted">
              <FolderKanban className="size-6 text-muted-foreground" />
            </div>

            <h2 className="mt-4 text-lg font-semibold">No workspaces yet</h2>

            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Create a workspace to start organizing your projects and tasks.
            </p>

            <div className="mt-5">
              <CreateWorkspaceDialog onCreated={loadWorkspaces} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Workspace cards */}
      {!error && workspaces.length > 0 && (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {workspaces.map((membership) => {
            const workspace = membership.workspace;

            return (
              <Link
                key={membership.id}
                href={`/dashboard/workspaces/${workspace.id}`}
                className="group"
              >
                <Card className="h-full transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 gap-4">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted">
                          <FolderKanban className="size-5 text-muted-foreground" />
                        </div>

                        <div className="min-w-0">
                          <h2 className="truncate font-semibold">
                            {workspace.name}
                          </h2>

                          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                            {workspace.description ||
                              "No description provided."}
                          </p>

                          <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            {membership.role}
                          </p>
                        </div>
                      </div>

                      <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
