"use client";

import { useEffect, useState } from "react";
import { Activity as ActivityIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";

import { activityService } from "@/services/activity.service";
import { Activity } from "@/types/activity.types";

interface WorkspaceActivityProps {
  workspaceId: string;
}

export function WorkspaceActivity({ workspaceId }: WorkspaceActivityProps) {
  const [activities, setActivities] = useState<Activity[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        setIsLoading(true);

        const response =
          await activityService.getWorkspaceActivities(workspaceId);

        console.log("WORKSPACE ACTIVITIES:", response);

        if (!response?.success) {
          throw new Error(response?.message || "Unable to load activities.");
        }

        setActivities(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Get workspace activities error:", error);

        toast.error(
          error instanceof Error ? error.message : "Unable to load activities.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (workspaceId) {
      loadActivities();
    }
  }, [workspaceId]);

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

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
      <CardContent className="p-6">
        <div className="space-y-6">
          {activities.map((activity) => {
            const userName = activity.performer?.name || "Unknown user";

            return (
              <div key={activity.id} className="flex gap-4">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                  {userName.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-medium">{userName}</p>

                    <time className="text-xs text-muted-foreground">
                      {new Date(activity.createdAt).toLocaleString()}
                    </time>
                  </div>

                  <p className="mt-1 text-sm text-muted-foreground">
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
