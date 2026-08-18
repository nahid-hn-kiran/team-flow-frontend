import { RegisterForm } from "@/components/modules/Auth/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </main>
  );
}
