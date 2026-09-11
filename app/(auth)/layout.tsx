'use client';
import { AuthLayout } from "@/platform/pages/Auth/AuthLayout";

export default function AuthGroupLayout({ children }: { children: React.ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
}
