/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { Loader2, MessageCircle, Pencil, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { TaskComment } from "@/types/comment.types";
import { commentService } from "@/services/comment.service";

interface TaskCommentsProps {
  workspaceId: string;
  projectId: string;
  taskId: string;
}

export function TaskComments({
  workspaceId,
  projectId,
  taskId,
}: TaskCommentsProps) {
  const [comments, setComments] = useState<TaskComment[]>([]);

  const [content, setContent] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);

  const [editingContent, setEditingContent] = useState("");

  const loadComments = async () => {
    try {
      setIsLoading(true);

      const response = await commentService.getTaskComments(
        workspaceId,
        projectId,
        taskId,
      );

      if (!response?.success) {
        throw new Error(response?.message || "Unable to load comments.");
      }

      setComments(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Get task comments error:", error);

      toast.error(
        error instanceof Error ? error.message : "Unable to load comments.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [workspaceId, projectId, taskId]);

  const handleCreateComment = async () => {
    const trimmedContent = content.trim();

    if (!trimmedContent) {
      toast.error("Comment cannot be empty.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await commentService.createComment(
        workspaceId,
        projectId,
        taskId,
        trimmedContent,
      );

      if (!response?.success) {
        throw new Error(response?.message || "Unable to create comment.");
      }

      setContent("");

      toast.success("Comment added.");

      await loadComments();
    } catch (error) {
      console.error("Create comment error:", error);

      toast.error(
        error instanceof Error ? error.message : "Unable to create comment.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEditing = (comment: TaskComment) => {
    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
  };

  const handleCancelEditing = () => {
    setEditingCommentId(null);
    setEditingContent("");
  };

  const handleUpdateComment = async () => {
    if (!editingCommentId) {
      return;
    }

    const trimmedContent = editingContent.trim();

    if (!trimmedContent) {
      toast.error("Comment cannot be empty.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await commentService.updateComment(
        workspaceId,
        projectId,
        taskId,
        editingCommentId,
        trimmedContent,
      );

      if (!response?.success) {
        throw new Error(response?.message || "Unable to update comment.");
      }

      toast.success("Comment updated.");

      handleCancelEditing();

      await loadComments();
    } catch (error) {
      console.error("Update comment error:", error);

      toast.error(
        error instanceof Error ? error.message : "Unable to update comment.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await commentService.deleteComment(
        workspaceId,
        projectId,
        taskId,
        commentId,
      );

      if (!response?.success) {
        throw new Error(response?.message || "Unable to delete comment.");
      }

      toast.success("Comment deleted.");

      await loadComments();
    } catch (error) {
      console.error("Delete comment error:", error);

      toast.error(
        error instanceof Error ? error.message : "Unable to delete comment.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="size-5" />
          Comments
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Create comment */}
        <div className="space-y-3">
          <Textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Write a comment..."
            disabled={isSubmitting}
            className="min-h-[100px] resize-none"
          />

          <div className="flex justify-end">
            <Button
              onClick={handleCreateComment}
              disabled={isSubmitting || !content.trim()}
            >
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
              Comment
            </Button>
          </div>
        </div>

        {/* Comments */}
        {isLoading ? (
          <div className="flex min-h-[120px] items-center justify-center">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : comments.length === 0 ? (
          <div className="flex min-h-[120px] flex-col items-center justify-center text-center">
            <MessageCircle className="size-8 text-muted-foreground" />

            <p className="mt-3 text-sm font-medium">No comments yet</p>

            <p className="mt-1 text-sm text-muted-foreground">
              Start the conversation about this task.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {comments.map((comment) => {
              const isEditing = editingCommentId === comment.id;

              return (
                <div key={comment.id} className="flex gap-3">
                  {/* Avatar */}
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium">
                    {comment.author?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>

                  <div className="min-w-0 flex-1">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium">
                          {comment.author?.name || "Unknown user"}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleString()}
                        </p>
                      </div>

                      {!isEditing && (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            onClick={() => handleStartEditing(comment)}
                            disabled={isSubmitting}
                          >
                            <Pencil className="size-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteComment(comment.id)}
                            disabled={isSubmitting}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    {isEditing ? (
                      <div className="mt-3 space-y-3">
                        <Textarea
                          value={editingContent}
                          onChange={(event) =>
                            setEditingContent(event.target.value)
                          }
                          disabled={isSubmitting}
                          className="min-h-[90px] resize-none"
                        />

                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCancelEditing}
                            disabled={isSubmitting}
                          >
                            Cancel
                          </Button>

                          <Button
                            size="sm"
                            onClick={handleUpdateComment}
                            disabled={isSubmitting || !editingContent.trim()}
                          >
                            {isSubmitting && (
                              <Loader2 className="size-4 animate-spin" />
                            )}
                            Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-foreground/90">
                        {comment.content}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
