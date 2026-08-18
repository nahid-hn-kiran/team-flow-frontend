import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <Card className="border-border/60 shadow-xl">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Mail className="size-6" />
            </div>

            <div className="space-y-1">
              <CardTitle className="text-2xl">Forgot your password?</CardTitle>

              <CardDescription>
                Enter your email and we&apos;ll send you a password reset link.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>

                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>

              <Button type="submit" className="w-full">
                Send reset link
              </Button>

              <div className="text-center">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ArrowLeft className="size-4" />
                  Back to login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
