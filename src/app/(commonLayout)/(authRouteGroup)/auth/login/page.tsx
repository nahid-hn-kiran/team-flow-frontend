import { LoginForm } from "@/components/modules/Auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
