'use client';
import { AuthLayout } from "@/platform/pages/Auth/AuthLayout";
import SignupPage from "@/platform/pages/Auth/SignupPage";

export default function Signup() {
  return (
    <AuthLayout>
      <SignupPage />
    </AuthLayout>
  );
}
