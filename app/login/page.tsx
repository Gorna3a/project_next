'use client';
import { AuthLayout } from "@/platform/pages/Auth/AuthLayout";
import LoginPage from "@/platform/pages/Auth/LoginPage";

export default function Login() {
  return (
    <AuthLayout>
      <LoginPage />
    </AuthLayout>
  );
}
