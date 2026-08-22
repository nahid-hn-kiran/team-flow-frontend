"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";

import { workspaceService } from "@/services/workspace.service";

interface EditWorkspaceDialogProps {
  workspaceId: string;
  name: string;
  description: string | null;
  onUpdated: () => void | Promise<void>;
}

export function EditWorkspaceDialog({
  workspaceId,
  name,
  description,
  onUpdated,
}: EditWorkspaceDialogProps) {
  const [open, setOpen] = useState(false);

  const [workspaceName, setWorkspaceName] = useState(name);
  const [workspaceDescription, setWorkspaceDescription] = useState(
    description || "",
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenChange = (value: boolean) => {
    if (isSubmitting) {
      return;
    }

    setOpen(value);

    if (value) {
      setWorkspaceName(name);
      setWorkspaceDescription(description || "");
    }
  };

  const handleUpdate = async () => {
    const trimmedName = workspaceName.trim();
    const trimmedDescription = workspaceDescription.trim();

    if (!trimmedName) {
      toast.error("Workspace name is required.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await workspaceService.updateWorkspace(workspaceId, {
        name: trimmedName,
        description: trimmedDescription || undefined,
      });

      if (!response?.success) {
        throw new Error(response?.message || "Unable to update workspace.");
      }

      toast.success("Workspace updated successfully.");

      setOpen(false);

      await onUpdated();
    } catch (error) {
      console.error("Update workspace error:", error);

      toast.error(
        error instanceof Error ? error.message : "Unable to update workspace.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button variant="outline">
            <Pencil className="size-4" />
            Edit workspace
          </Button>
        }
      />

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit workspace</DialogTitle>

          <DialogDescription>
            Update the name and description of this workspace.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <label htmlFor="workspace-name" className="text-sm font-medium">
              Name
            </label>

            <Input
              id="workspace-name"
              value={workspaceName}
              onChange={(event) => setWorkspaceName(event.target.value)}
              placeholder="My workspace"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="workspace-description"
              className="text-sm font-medium"
            >
              Description
            </label>

            <Textarea
              id="workspace-description"
              value={workspaceDescription}
              onChange={(event) => setWorkspaceDescription(event.target.value)}
              placeholder="Describe this workspace..."
              rows={4}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button
            onClick={handleUpdate}
            disabled={isSubmitting || !workspaceName.trim()}
          >
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
