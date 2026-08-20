/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { Loader2, Pencil } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { taskService } from "@/services/task.service";

interface EditTaskDialogProps {
  workspaceId: string;
  projectId: string;
  taskId: string;
  title: string;
  description?: string | null;
  onUpdated: (task: { title: string; description: string | null }) => void;
}

export function EditTaskDialog({
  workspaceId,
  projectId,
  taskId,
  title,
  description,
  onUpdated,
}: EditTaskDialogProps) {
  const [open, setOpen] = useState(false);

  const [taskTitle, setTaskTitle] = useState(title);
  const [taskDescription, setTaskDescription] = useState(description ?? "");

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    setTaskTitle(title);
    setTaskDescription(description ?? "");
  }, [open, title, description]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = taskTitle.trim();
    const trimmedDescription = taskDescription.trim();

    if (!trimmedTitle) {
      toast.error("Task title is required.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await taskService.updateTask(
        workspaceId,
        projectId,
        taskId,
        {
          title: trimmedTitle,
          description: trimmedDescription || undefined,
        },
      );

      if (!response?.success) {
        throw new Error(response?.message || "Unable to update task.");
      }

      const updatedTask = response.data;

      onUpdated({
        title: updatedTask.title,
        description: updatedTask.description ?? null,
      });

      toast.success("Task updated successfully.");

      setOpen(false);
    } catch (error) {
      console.error("Update task error:", error);

      toast.error(
        error instanceof Error ? error.message : "Unable to update task.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="outline">
          <Pencil className="size-4" />
          Edit task
        </Button>
      </DialogTrigger>

      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit task</DialogTitle>

            <DialogDescription>
              Update the title and description of this task.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-6">
            <div className="space-y-2">
              <Label htmlFor="task-title">Title</Label>

              <Input
                id="task-title"
                value={taskTitle}
                onChange={(event) => setTaskTitle(event.target.value)}
                placeholder="Enter task title"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="task-description">Description</Label>

              <Textarea
                id="task-description"
                value={taskDescription}
                onChange={(event) => setTaskDescription(event.target.value)}
                placeholder="Describe the task..."
                className="min-h-32 resize-none"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
