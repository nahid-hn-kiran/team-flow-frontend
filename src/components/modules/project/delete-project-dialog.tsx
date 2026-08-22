"use client";

import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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

import { projectService } from "@/services/project.service";

interface DeleteProjectDialogProps {
  workspaceId: string;
  projectId: string;
  projectName: string;
}

export function DeleteProjectDialog({
  workspaceId,
  projectId,
  projectName,
}: DeleteProjectDialogProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      const response = await projectService.deleteProject(
        workspaceId,
        projectId,
      );

      if (!response?.success) {
        throw new Error(response?.message || "Unable to delete project.");
      }

      toast.success("Project deleted successfully.");

      setOpen(false);

      router.push(`/dashboard/workspaces/${workspaceId}`);
    } catch (error) {
      console.error("Delete project error:", error);

      toast.error(
        error instanceof Error ? error.message : "Unable to delete project.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        type="button"
        render={
          <Button variant="destructive">
            <Trash2 className="size-4" />
            Delete project
          </Button>
        }
      />

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete project?</DialogTitle>

          <DialogDescription>
            This will delete{" "}
            <span className="font-medium text-foreground">{projectName}</span>.
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting && <Loader2 className="size-4 animate-spin" />}
            Delete project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
