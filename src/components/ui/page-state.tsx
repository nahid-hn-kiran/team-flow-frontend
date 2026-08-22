import { AlertCircle, FolderOpen, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Loading..." }: LoadingStateProps) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />

      <p className="mt-3 text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  message = "Unable to load this page.",
  onRetry,
}: ErrorStateProps) {
  return (
    <Card>
      <CardContent className="flex min-h-[300px] flex-col items-center justify-center text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="size-6 text-destructive" />
        </div>

        <h2 className="mt-4 text-lg font-semibold">{title}</h2>

        <p className="mt-2 max-w-md text-sm text-muted-foreground">{message}</p>

        {onRetry && (
          <Button className="mt-5" variant="outline" onClick={onRetry}>
            Try again
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="flex min-h-[300px] flex-col items-center justify-center text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <FolderOpen className="size-6 text-muted-foreground" />
        </div>

        <h2 className="mt-4 text-lg font-semibold">{title}</h2>

        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          {description}
        </p>

        {action && <div className="mt-5">{action}</div>}
      </CardContent>
    </Card>
  );
}
