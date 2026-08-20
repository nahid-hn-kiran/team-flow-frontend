/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import {
  Check,
  ChevronsUpDown,
  Loader2,
  UserRound,
  UserRoundPlus,
} from "lucide-react";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { workspaceService } from "@/services/workspace.service";
import { taskService } from "@/services/task.service";

interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  role: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface AssignTaskDialogProps {
  workspaceId: string;
  projectId: string;
  taskId: string;
  currentAssigneeId?: string | null;
  currentAssigneeName?: string | null;
  onAssigned: (member: WorkspaceMember) => void;
}

export function AssignTaskDialog({
  workspaceId,
  projectId,
  taskId,
  currentAssigneeId,
  currentAssigneeName,
  onAssigned,
}: AssignTaskDialogProps) {
  const [open, setOpen] = useState(false);

  const [members, setMembers] = useState<WorkspaceMember[]>([]);

  const [selectedMemberId, setSelectedMemberId] = useState(
    currentAssigneeId ?? "",
  );

  const [isLoadingMembers, setIsLoadingMembers] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [memberPickerOpen, setMemberPickerOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    setSelectedMemberId(currentAssigneeId ?? "");

    const loadMembers = async () => {
      try {
        setIsLoadingMembers(true);

        const response =
          await workspaceService.getWorkspaceMembers(workspaceId);

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
        setIsLoadingMembers(false);
      }
    };

    loadMembers();
  }, [open, workspaceId, currentAssigneeId]);

  const selectedMember = members.find(
    (member) =>
      member.userId === selectedMemberId || member.id === selectedMemberId,
  );

  const handleAssign = async () => {
    if (!selectedMember) {
      toast.error("Please select a member.");
      return;
    }

    try {
      setIsSubmitting(true);

      /*
       * We send the USER ID because the task's
       * assignee represents the actual user.
       */
      const response = await taskService.assignTask(
        workspaceId,
        projectId,
        taskId,
        selectedMember.userId,
      );

      if (!response?.success) {
        throw new Error(response?.message || "Unable to assign task.");
      }

      onAssigned(selectedMember);

      toast.success(`Task assigned to ${selectedMember.user.name}.`);

      setOpen(false);
    } catch (error) {
      console.error("Assign task error:", error);

      toast.error(
        error instanceof Error ? error.message : "Unable to assign task.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="outline" className="w-full justify-start">
          <UserRoundPlus className="size-4" />

          {currentAssigneeName ? "Change assignee" : "Assign task"}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign task</DialogTitle>

          <DialogDescription>
            Select a workspace member to assign this task to.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          {isLoadingMembers ? (
            <div className="flex h-24 items-center justify-center">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Popover open={memberPickerOpen} onOpenChange={setMemberPickerOpen}>
              <PopoverTrigger>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between"
                >
                  {selectedMember ? (
                    <span className="flex min-w-0 items-center gap-2">
                      <UserRound className="size-4 shrink-0" />

                      <span className="truncate">
                        {selectedMember.user.name}
                      </span>
                    </span>
                  ) : (
                    "Select a member"
                  )}

                  <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent
                align="start"
                className="w-[var(--radix-popover-trigger-width)] p-0"
              >
                <Command>
                  <CommandInput placeholder="Search members..." />

                  <CommandList>
                    <CommandEmpty>No members found.</CommandEmpty>

                    <CommandGroup>
                      {members.map((member) => {
                        const isSelected =
                          member.userId === selectedMemberId ||
                          member.id === selectedMemberId;

                        return (
                          <CommandItem
                            key={member.id}
                            value={`${member.user.name} ${member.user.email}`}
                            onSelect={() => {
                              setSelectedMemberId(member.userId);

                              setMemberPickerOpen(false);
                            }}
                          >
                            <div className="flex min-w-0 flex-1 items-center gap-3">
                              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                                <UserRound className="size-4" />
                              </div>

                              <div className="min-w-0">
                                <p className="truncate text-sm font-medium">
                                  {member.user.name}
                                </p>

                                <p className="truncate text-xs text-muted-foreground">
                                  {member.user.email}
                                </p>
                              </div>
                            </div>

                            <Check
                              className={
                                isSelected
                                  ? "ml-auto size-4 opacity-100"
                                  : "ml-auto size-4 opacity-0"
                              }
                            />
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          )}
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

          <Button
            type="button"
            onClick={handleAssign}
            disabled={isSubmitting || isLoadingMembers || !selectedMember}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Assigning...
              </>
            ) : (
              "Assign task"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
