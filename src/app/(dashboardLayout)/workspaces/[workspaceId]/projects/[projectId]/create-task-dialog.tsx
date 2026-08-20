"use client";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
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

interface CreateTaskDialogProps {
  workspaceId: string;
  projectId: string;
  onCreated?: () => void;
}

export function CreateTaskDialog({
  workspaceId,
  projectId,
  onCreated,
}: CreateTaskDialogProps) {
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setTitle("");
    setDescription("");
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      toast.error("Task title is required.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await taskService.createTask(workspaceId, projectId, {
        title: title.trim(),
        description: description.trim() || undefined,
      });

      if (!response?.success) {
        throw new Error(response?.message || "Unable to create task.");
      }

      toast.success("Task created successfully.");

      resetForm();
      setOpen(false);

      onCreated?.();
    } catch (error) {
      console.error("Create task error:", error);

      toast.error(
        error instanceof Error ? error.message : "Unable to create task.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!isLoading) {
          setOpen(value);

          if (!value) {
            resetForm();
          }
        }
      }}
    >
      <DialogTrigger
        render={
          <Button>
            <Plus className="size-4" />
            New project
          </Button>
        }
      />

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create task</DialogTitle>

          <DialogDescription>Add a new task to this project.</DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="space-y-2">
            <Label htmlFor="task-title">Task title</Label>

            <Input
              id="task-title"
              placeholder="e.g. Build authentication page"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              disabled={isLoading}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-description">Description</Label>

            <Textarea
              id="task-description"
              placeholder="Describe what needs to be done..."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              disabled={isLoading}
              rows={5}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleCreate}
            disabled={isLoading || !title.trim()}
          >
            {isLoading && <Loader2 className="size-4 animate-spin" />}

            {isLoading ? "Creating..." : "Create task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
