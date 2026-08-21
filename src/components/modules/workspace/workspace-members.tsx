/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  Mail,
  MoreHorizontal,
  Shield,
  Trash2,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { workspaceService } from "@/services/workspace.service";
import { WorkspaceMember } from "@/types/workspace.types";

interface WorkspaceMembersProps {
  workspaceId: string;
}

export function WorkspaceMembers({ workspaceId }: WorkspaceMembersProps) {
  const [members, setMembers] = useState<WorkspaceMember[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"MEMBER" | "ADMIN">("MEMBER");

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [editingMember, setEditingMember] = useState<WorkspaceMember | null>(
    null,
  );

  const loadMembers = async () => {
    try {
      setIsLoading(true);

      const response = await workspaceService.getWorkspaceMembers(workspaceId);

      console.log("WORKSPACE MEMBERS:", response);

      if (!response?.success) {
        throw new Error(
          response?.message || "Unable to load workspace members.",
        );
      }

      setMembers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Get workspace members error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to load workspace members.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (workspaceId) {
      loadMembers();
    }
  }, [workspaceId]);

  const handleAddMember = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      toast.error("Please enter an email address.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await workspaceService.addWorkspaceMember(workspaceId, {
        email: trimmedEmail,
        role,
      });

      if (!response?.success) {
        throw new Error(response?.message || "Unable to add member.");
      }

      toast.success("Member added successfully.");

      setEmail("");
      setRole("MEMBER");
      setIsAddDialogOpen(false);

      await loadMembers();
    } catch (error) {
      console.error("Add workspace member error:", error);

      toast.error(
        error instanceof Error ? error.message : "Unable to add member.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateRole = async () => {
    if (!editingMember) {
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await workspaceService.updateWorkspaceMemberRole(
        workspaceId,
        editingMember.id,
        editingMember.role as "MEMBER" | "ADMIN",
      );

      if (!response?.success) {
        throw new Error(response?.message || "Unable to update member role.");
      }

      toast.success("Member role updated.");

      setEditingMember(null);

      await loadMembers();
    } catch (error) {
      console.error("Update member role error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to update member role.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveMember = async (member: WorkspaceMember) => {
    const confirmed = window.confirm(
      `Remove ${member.user?.name || "this member"} from the workspace?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await workspaceService.removeWorkspaceMember(
        workspaceId,
        member.id,
      );

      if (!response?.success) {
        throw new Error(response?.message || "Unable to remove member.");
      }

      toast.success("Member removed.");

      await loadMembers();
    } catch (error) {
      console.error("Remove workspace member error:", error);

      toast.error(
        error instanceof Error ? error.message : "Unable to remove member.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Workspace</p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            Members
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Manage the people who have access to this workspace.
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger
            render={
              <Button>
                <Users className="size-4" />
                Add member
              </Button>
            }
          />

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add workspace member</DialogTitle>

              <DialogDescription>
                Add an existing TeamFlow user to this workspace.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <label htmlFor="member-email" className="text-sm font-medium">
                  Email
                </label>

                <Input
                  id="member-email"
                  type="email"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>

                <Select
                  value={role}
                  onValueChange={(value) =>
                    setRole(value as "MEMBER" | "ADMIN")
                  }
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="MEMBER">Member</SelectItem>

                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>

              <Button
                onClick={handleAddMember}
                disabled={isSubmitting || !email.trim()}
              >
                {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                Add member
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Empty */}
      {members.length === 0 ? (
        <Card>
          <CardContent className="flex min-h-[300px] flex-col items-center justify-center text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <Users className="size-6 text-muted-foreground" />
            </div>

            <h2 className="mt-4 text-lg font-semibold">No members</h2>

            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Add people to collaborate on projects and tasks in this workspace.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted font-medium">
                      {member.user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {member.user?.name || "Unknown user"}
                      </p>

                      <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Mail className="size-3.5" />

                        {member.user?.email || "No email"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-medium">
                      <Shield className="size-3.5" />

                      {member.role}
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={isSubmitting}
                      onClick={() => setEditingMember(member)}
                    >
                      <MoreHorizontal className="size-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      disabled={isSubmitting}
                      onClick={() => handleRemoveMember(member)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit role dialog */}
      <Dialog
        open={!!editingMember}
        onOpenChange={(open) => {
          if (!open) {
            setEditingMember(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update member role</DialogTitle>

            <DialogDescription>
              Change the role of {editingMember?.user?.name || "this member"}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-2">
            <label className="text-sm font-medium">Role</label>

            <Select
              value={editingMember?.role || "MEMBER"}
              onValueChange={(value) =>
                setEditingMember((current) =>
                  current
                    ? {
                        ...current,
                        role: value,
                      }
                    : current,
                )
              }
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="MEMBER">Member</SelectItem>

                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingMember(null)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button onClick={handleUpdateRole} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
