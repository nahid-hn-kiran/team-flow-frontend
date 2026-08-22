"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface AppBreadcrumbsProps {
  workspaceName?: string;
  projectName?: string;
  taskName?: string;
}

export function AppBreadcrumbs({
  workspaceName = "Workspace",
  projectName,
  taskName,
}: AppBreadcrumbsProps) {
  const pathname = usePathname();

  const workspaceMatch = pathname.match(/^\/workspaces\/([^/]+)/);

  const workspaceId = workspaceMatch?.[1];

  if (!workspaceId) {
    return null;
  }

  const isProjectPage = pathname.includes("/projects/");
  const isTaskPage = pathname.includes("/tasks/");

  return (
    <Breadcrumb className="mb-5">
      <BreadcrumbList>
        {/* Home */}
        <BreadcrumbItem>
          <BreadcrumbLink>
            <Link href="/dashboard/workspaces">
              <Home className="size-3.5" />
              <span className="sr-only">Workspaces</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator>
          <ChevronRight className="size-3.5" />
        </BreadcrumbSeparator>

        {/* Workspace */}
        <BreadcrumbItem>
          {isProjectPage || isTaskPage ? (
            <BreadcrumbLink>
              <Link href={`/dashboard/workspaces/${workspaceId}`}>
                {workspaceName}
              </Link>
            </BreadcrumbLink>
          ) : (
            <BreadcrumbPage>{workspaceName}</BreadcrumbPage>
          )}
        </BreadcrumbItem>

        {/* Project */}
        {(isProjectPage || isTaskPage) && (
          <>
            <BreadcrumbSeparator>
              <ChevronRight className="size-3.5" />
            </BreadcrumbSeparator>

            <BreadcrumbItem>
              {isTaskPage ? (
                <BreadcrumbLink>
                  <Link href={`/dashboard/workspaces/${workspaceId}/projects`}>
                    Projects
                  </Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{projectName || "Project"}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </>
        )}

        {/* Task */}
        {isTaskPage && (
          <>
            <BreadcrumbSeparator>
              <ChevronRight className="size-3.5" />
            </BreadcrumbSeparator>

            <BreadcrumbItem>
              <BreadcrumbPage>{taskName || "Task"}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
