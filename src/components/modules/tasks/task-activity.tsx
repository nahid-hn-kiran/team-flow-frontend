"use client";

import { useEffect, useState } from "react";
import { Activity as ActivityIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";

import { activityService } from "@/services/activity.service";
import { Activity } from "@/types/activity.types";

interface TaskActivityProps {
  workspaceId: string;
  taskId: string;
}

export function TaskActivity({ workspaceId, taskId }: TaskActivityProps) {
  const [activities, setActivities] = useState<Activity[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        setIsLoading(true);

        const response = await activityService.getTaskActivities(
          workspaceId,
          taskId,
        );

        console.log("TASK ACTIVITIES:", response);

        if (!response?.success) {
          throw new Error(
            response?.message || "Unable to load task activities.",
          );
        }

        setActivities(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Get task activities error:", error);

        toast.error(
          error instanceof Error
            ? error.message
            : "Unable to load task activities.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (workspaceId && taskId) {
      loadActivities();
    }
  }, [workspaceId, taskId]);

  if (isLoading) {
    return (
      <div className="flex min-h-[180px] items-center justify-center">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <Card>
        <CardContent className="flex min-h-[180px] flex-col items-center justify-center text-center">
          <ActivityIcon className="size-7 text-muted-foreground" />

          <p className="mt-3 text-sm font-medium">No activity yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-5">
          {activities.map((activity) => {
            const userName = activity.performer?.name || "Unknown user";

            return (
              <div key={activity.id} className="flex gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
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
