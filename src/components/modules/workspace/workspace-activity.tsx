/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { Activity as ActivityIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { activityService } from "@/services/activity.service";
import { Activity } from "@/types/activity.types";

interface WorkspaceActivityProps {
  workspaceId: string;
}

export function WorkspaceActivity({ workspaceId }: WorkspaceActivityProps) {
  const [activities, setActivities] = useState<Activity[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const loadActivities = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response =
        await activityService.getWorkspaceActivities(workspaceId);

      console.log("WORKSPACE ACTIVITIES:", response);

      if (!response?.success) {
        throw new Error(response?.message || "Unable to load activities.");
      }

      setActivities(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Get workspace activities error:", error);

      const message =
        error instanceof Error ? error.message : "Unable to load activities.";

      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (workspaceId) {
      loadActivities();
    }
  }, [workspaceId]);

  /* Loading */
  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex min-h-[300px] items-center justify-center">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  /* Error */
  if (error) {
    return (
      <Card>
        <CardContent className="flex min-h-[300px] flex-col items-center justify-center text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <ActivityIcon className="size-6 text-muted-foreground" />
          </div>

          <h2 className="mt-4 font-semibold">Unable to load activity</h2>

          <p className="mt-2 max-w-md text-sm text-muted-foreground">{error}</p>

          <Button variant="outline" className="mt-5" onClick={loadActivities}>
            Try again
          </Button>
        </CardContent>
      </Card>
    );
  }

  /* Empty */
  if (activities.length === 0) {
    return (
      <Card>
        <CardContent className="flex min-h-[300px] flex-col items-center justify-center text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <ActivityIcon className="size-6 text-muted-foreground" />
          </div>

          <h2 className="mt-4 text-lg font-semibold">No activity yet</h2>

          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Workspace activity will appear here as your team works on projects
            and tasks.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="divide-y">
          {activities.map((activity) => {
            const userName = activity.performer?.name || "Unknown user";

            const initials =
              userName
                .split(" ")
                .map((part) => part.charAt(0))
                .join("")
                .slice(0, 2)
                .toUpperCase() || "U";

            return (
              <div
                key={activity.id}
                className="flex gap-4 p-5 transition-colors hover:bg-muted/30"
              >
                {/* Avatar */}
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                  {initials}
                </div>

                {/* Activity */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                    <p className="font-medium">{userName}</p>

                    <time className="shrink-0 text-xs text-muted-foreground">
                      {new Date(activity.createdAt).toLocaleString()}
                    </time>
                  </div>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {activity.description || activity.action}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
