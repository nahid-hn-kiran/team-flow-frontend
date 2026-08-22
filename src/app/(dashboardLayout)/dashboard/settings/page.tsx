import Link from "next/link";
import { ArrowLeft, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardContent className="flex flex-col items-center px-6 py-12 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-muted">
            <Settings className="size-7 text-muted-foreground" />
          </div>

          <h1 className="mt-6 text-2xl font-semibold tracking-tight">
            Settings
          </h1>

          <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
            We&apos;re working on this page. Account preferences, notifications,
            security settings, and other configuration options will be available
            here soon.
          </p>

          <Link
            href="/dashboard"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring mt-4"
          >
            <ArrowLeft className="size-4" />
            Back to dashboard
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
