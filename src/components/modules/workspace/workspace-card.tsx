import Link from "next/link";
import { ArrowUpRight, FolderKanban } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { IWorkspace } from "@/types/workspace.types";

interface WorkspaceCardProps {
  workspace: IWorkspace;
}

export function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  return (
    <Link href={`/workspaces/${workspace.id}`} className="group block">
      <Card className="h-full overflow-hidden border-border/70 bg-background transition-all duration-200 group-hover:-translate-y-1 group-hover:border-primary/30 group-hover:shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-5">
            <div className="flex min-w-0 gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <FolderKanban className="size-5" />
              </div>

              <div className="min-w-0 pt-0.5">
                <h2 className="truncate text-base font-semibold">
                  {workspace.name}
                </h2>

                <p className="mt-1.5 line-clamp-2 text-sm leading-5 text-muted-foreground">
                  {workspace.description || "No description provided."}
                </p>
              </div>
            </div>

            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-all group-hover:bg-primary/10 group-hover:text-primary">
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>

          <div className="mt-6 border-t pt-4">
            <span className="text-xs font-medium text-muted-foreground transition-colors group-hover:text-primary">
              Open workspace
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
