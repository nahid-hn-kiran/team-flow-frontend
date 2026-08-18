import { ResetPasswordForm } from "@/components/modules/Auth/reset-password-form";
import { Suspense } from "react";

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <Suspense
          fallback={
            <div className="text-center text-sm text-muted-foreground">
              Loading...
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </div>
    </main>
  );
}
