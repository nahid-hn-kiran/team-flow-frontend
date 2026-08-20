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

import { workspaceService } from "@/services/workspace.service";
import { IWorkspace } from "@/types/workspace.types";

interface CreateWorkspaceDialogProps {
  onCreated: (workspace: IWorkspace) => void;
}

export function CreateWorkspaceDialog({
  onCreated,
}: CreateWorkspaceDialogProps) {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setName("");
    setDescription("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName) {
      toast.error("Workspace name is required.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await workspaceService.createWorkspace({
        name: trimmedName,
        description: trimmedDescription || undefined,
      });

      if (!response?.success || !response.data) {
        throw new Error(response?.message || "Unable to create workspace.");
      }

      onCreated(response.data);

      toast.success("Workspace created successfully.");

      resetForm();
      setOpen(false);
    } catch (error) {
      console.error("Create workspace error:", error);

      toast.error(
        error instanceof Error ? error.message : "Unable to create workspace.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (value: boolean) => {
    if (isSubmitting) {
      return;
    }

    setOpen(value);

    if (!value) {
      resetForm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button type="button">
            <Plus className="size-4" />
            New workspace
          </Button>
        }
      />

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create workspace</DialogTitle>

          <DialogDescription>
            Create a workspace to organize your projects, tasks, and team
            members.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="workspace-name">Name</Label>

            <Input
              id="workspace-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. TeamFlow"
              disabled={isSubmitting}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="workspace-description">Description</Label>

            <Textarea
              id="workspace-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="What is this workspace for?"
              disabled={isSubmitting}
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isSubmitting || !name.trim()}>
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="size-4" />
                  Create workspace
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
