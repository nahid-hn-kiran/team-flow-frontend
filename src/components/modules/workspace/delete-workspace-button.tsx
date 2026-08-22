"use client";

import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { workspaceService } from "@/services/workspace.service";

interface DeleteWorkspaceButtonProps {
  workspaceId: string;
  workspaceName: string;
  onDeleted: () => void;
}

export function DeleteWorkspaceButton({
  workspaceId,
  workspaceName,
  onDeleted,
}: DeleteWorkspaceButtonProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      const response = await workspaceService.deleteWorkspace(workspaceId);

      if (!response?.success) {
        throw new Error(response?.message || "Unable to delete workspace.");
      }

      toast.success("Workspace deleted successfully.");

      setOpen(false);

      onDeleted();
    } catch (error) {
      console.error("Delete workspace error:", error);

      toast.error(
        error instanceof Error ? error.message : "Unable to delete workspace.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button
        variant="destructive"
        onClick={() => setOpen(true)}
        disabled={isDeleting}
      >
        <Trash2 className="size-4" />
        Delete workspace
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete workspace?</DialogTitle>

            <DialogDescription>
              You are about to delete{" "}
              <span className="font-medium text-foreground">
                {workspaceName}
              </span>
              . This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="size-4 animate-spin" />}
              Delete workspace
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
