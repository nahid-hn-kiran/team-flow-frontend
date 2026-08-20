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

import { projectService } from "@/services/project.service";

interface CreateProjectDialogProps {
  workspaceId: string;
  onCreated?: () => void;
}

export function CreateProjectDialog({
  workspaceId,
  onCreated,
}: CreateProjectDialogProps) {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setName("");
    setDescription("");
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error("Project name is required.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await projectService.createProject(workspaceId, {
        name: name.trim(),
        description: description.trim() || undefined,
      });

      if (!response?.success) {
        throw new Error(response?.message || "Unable to create project.");
      }

      toast.success("Project created successfully.");

      resetForm();
      setOpen(false);

      onCreated?.();
    } catch (error) {
      console.error("Create project error:", error);

      toast.error(
        error instanceof Error ? error.message : "Unable to create project.",
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
          <DialogTitle>Create project</DialogTitle>

          <DialogDescription>
            Create a project inside this workspace.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="space-y-2">
            <Label htmlFor="project-name">Project name</Label>

            <Input
              id="project-name"
              placeholder="e.g. Website Redesign"
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={isLoading}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-description">Description</Label>

            <Textarea
              id="project-description"
              placeholder="What is this project about?"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              disabled={isLoading}
              rows={4}
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
            disabled={isLoading || !name.trim()}
          >
            {isLoading && <Loader2 className="size-4 animate-spin" />}

            {isLoading ? "Creating..." : "Create project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
