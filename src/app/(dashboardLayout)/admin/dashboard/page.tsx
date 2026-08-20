"use client";

import { ArrowUpRight, CheckSquare, FolderKanban, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

import { useAuth } from "@/providers/auth-provider";

const stats = [
  {
    title: "Total Users",
    value: "1,284",
    change: "+12.5%",
    description: "from last month",
    icon: Users,
  },
  {
    title: "Projects",
    value: "248",
    change: "+8.2%",
    description: "from last month",
    icon: FolderKanban,
  },
  {
    title: "Active Tasks",
    value: "1,842",
    change: "+14.3%",
    description: "from last month",
    icon: CheckSquare,
  },
  {
    title: "Completion Rate",
    value: "87.4%",
    change: "+4.8%",
    description: "from last month",
    icon: ArrowUpRight,
  },
];

const projects = [
  {
    name: "Website Redesign",
    owner: "Design Team",
    status: "In Progress",
    progress: 72,
  },
  {
    name: "Mobile Application",
    owner: "Development",
    status: "In Progress",
    progress: 48,
  },
  {
    name: "Marketing Campaign",
    owner: "Marketing",
    status: "Planning",
    progress: 24,
  },
];

export default function AdminDashboardPage() {
  const { user } = useAuth();

  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Overview</p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Good morning, {firstName}
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Here&apos;s what&apos;s happening across your workspace.
          </p>
        </div>

        <Button>Create project</Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.title} className="border-border/60">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>

                <div className="rounded-lg bg-muted p-2">
                  <Icon className="size-4" />
                </div>
              </CardHeader>

              <CardContent>
                <div className="text-2xl font-semibold">{stat.value}</div>

                <p className="mt-1 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {stat.change}
                  </span>{" "}
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main content */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Projects */}
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Projects</CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                Latest projects across your workspace.
              </p>
            </div>

            <Button variant="ghost" size="sm">
              View all
              <ArrowUpRight />
            </Button>
          </CardHeader>

          <CardContent>
            <div className="space-y-5">
              {projects.map((project) => (
                <div key={project.name} className="space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {project.name}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {project.owner}
                      </p>
                    </div>

                    <Badge variant="secondary" className="shrink-0">
                      {project.status}
                    </Badge>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{
                        width: `${project.progress}%`,
                      }}
                    />
                  </div>

                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Progress</span>

                    <span>{project.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              Latest workspace activity.
            </p>
          </CardHeader>

          <CardContent>
            <div className="space-y-6">
              {[
                "A new user joined the workspace.",
                "Website Redesign was updated.",
                "A task was marked as completed.",
                "Mobile Application received a new task.",
              ].map((activity, index) => (
                <div key={index} className="flex gap-3">
                  <div className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />

                  <div>
                    <p className="text-sm leading-5">{activity}</p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {index + 1} hour
                      {index !== 0 ? "s" : ""} ago
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
