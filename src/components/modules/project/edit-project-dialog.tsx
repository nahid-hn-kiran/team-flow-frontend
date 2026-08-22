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

import { projectService } from "@/services/project.service";

interface EditProjectDialogProps {
  workspaceId: string;
  projectId: string;
  name: string;
  description: string | null;
  onUpdated: (project: { name: string; description: string | null }) => void;
}

export function EditProjectDialog({
  workspaceId,
  projectId,
  name,
  description,
  onUpdated,
}: EditProjectDialogProps) {
  const [open, setOpen] = useState(false);

  const [projectName, setProjectName] = useState(name);
  const [projectDescription, setProjectDescription] = useState(
    description ?? "",
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setProjectName(name);
      setProjectDescription(description ?? "");
    }
  }, [open, name, description]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = projectName.trim();
    const trimmedDescription = projectDescription.trim();

    if (!trimmedName) {
      toast.error("Project name is required.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await projectService.updateProject(
        workspaceId,
        projectId,
        {
          name: trimmedName,
          description: trimmedDescription || undefined,
        },
      );

      if (!response?.success) {
        throw new Error(response?.message || "Unable to update project.");
      }

      onUpdated({
        name: trimmedName,
        description: trimmedDescription || null,
      });

      toast.success("Project updated successfully.");

      setOpen(false);
    } catch (error) {
      console.error("Update project error:", error);

      toast.error(
        error instanceof Error ? error.message : "Unable to update project.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        type="button"
        render={
          <Button variant="outline">
            <Pencil className="size-4" />
            Edit project
          </Button>
        }
      />

      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit project</DialogTitle>

            <DialogDescription>
              Update the project name and description.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-6">
            <div className="space-y-2">
              <Label htmlFor="project-name">Project name</Label>

              <Input
                id="project-name"
                value={projectName}
                onChange={(event) => setProjectName(event.target.value)}
                placeholder="Enter project name"
                disabled={isSubmitting}
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-description">Description</Label>

              <Textarea
                id="project-description"
                value={projectDescription}
                onChange={(event) => setProjectDescription(event.target.value)}
                placeholder="Describe this project..."
                rows={5}
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
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
