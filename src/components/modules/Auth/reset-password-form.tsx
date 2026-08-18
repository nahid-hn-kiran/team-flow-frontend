"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Mail,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/schemas/auth.schema";

import { authService } from "@/services/auth.service";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordReset, setPasswordReset] = useState(false);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      otp: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    if (!email) {
      toast.error("Email is missing. Please request a new OTP.");

      return;
    }

    try {
      await authService.resetPassword({
        email,
        otp: values.otp,
        newPassword: values.password,
      });

      setPasswordReset(true);

      toast.success("Your password has been reset successfully.");
    } catch (error) {
      const message =
        error &&
        typeof error === "object" &&
        "message" in error &&
        typeof error.message === "string"
          ? error.message
          : "Invalid or expired OTP. Please try again.";

      toast.error(message);
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  /*
   * No email in URL
   */
  if (!email) {
    return (
      <Card className="border-border/60 shadow-xl">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-destructive text-destructive-foreground">
            <Mail className="size-6" />
          </div>

          <div className="space-y-2">
            <CardTitle className="text-2xl">Email is missing</CardTitle>

            <CardDescription>
              We couldn&apost find the email address required to reset your
              password.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <Button
            className="w-full"
            onClick={() => router.push("/auth/forgot-password")}
          >
            Request a new OTP
          </Button>
        </CardContent>
      </Card>
    );
  }

  /*
   * Password reset successful
   */
  if (passwordReset) {
    return (
      <Card className="border-border/60 shadow-xl">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <CheckCircle2 className="size-6" />
          </div>

          <div className="space-y-2">
            <CardTitle className="text-2xl">
              Password reset successful
            </CardTitle>

            <CardDescription>
              Your password has been updated successfully. You can now sign in
              with your new password.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <Button className="w-full" onClick={() => router.push("/auth/login")}>
            Continue to login
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/60 shadow-xl">
      <CardHeader className="space-y-4 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <KeyRound className="size-6" />
        </div>

        <div className="space-y-2">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Reset your password
          </CardTitle>

          <CardDescription>
            Enter the verification code sent to your email and create a new
            password.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>

            <Input
              id="email"
              type="email"
              value={email}
              disabled
              className="bg-muted"
            />
          </div>

          {/* OTP */}
          <div className="space-y-2">
            <Label htmlFor="otp">Verification code</Label>

            <Input
              id="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              disabled={isSubmitting}
              {...form.register("otp")}
            />

            {form.formState.errors.otp && (
              <p className="text-sm text-destructive">
                {form.formState.errors.otp.message}
              </p>
            )}

            <p className="text-xs text-muted-foreground">
              Enter the 6-digit verification code sent to your email.
            </p>
          </div>

          {/* New password */}
          <div className="space-y-2">
            <Label htmlFor="password">New password</Label>

            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a new password"
                autoComplete="new-password"
                disabled={isSubmitting}
                className="pr-10"
                {...form.register("password")}
              />

              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                disabled={isSubmitting}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>

            {form.formState.errors.password && (
              <p className="text-sm text-destructive">
                {form.formState.errors.password.message}
              </p>
            )}

            <p className="text-xs text-muted-foreground">
              At least 8 characters with uppercase, lowercase, and a number.
            </p>
          </div>

          {/* Confirm password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm password</Label>

            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your new password"
                autoComplete="new-password"
                disabled={isSubmitting}
                className="pr-10"
                {...form.register("confirmPassword")}
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword((value) => !value)}
                disabled={isSubmitting}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>

            {form.formState.errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {form.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Resetting password...
              </>
            ) : (
              "Reset password"
            )}
          </Button>

          {/* Back to login */}
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
  );
}
