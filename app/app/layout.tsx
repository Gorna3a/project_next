'use client';
import { useState } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "@/platform/layout/Sidebar";
import { Header } from "@/platform/layout/Header";
import { useAuth } from "@/core/context/AuthContext";
import { useLanguage } from "@/core/context/LanguageContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const { user, loading } = useAuth();
  const { isRTL } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();

  // The in-browser IDE is a full-screen workspace: no sidebar/header/padding.
  const isIde = pathname.startsWith("/app/ide");

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading…</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  if (isIde) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "var(--bg-base)" }}>
        {children}
      </div>
    );
  }

  const marginValue = collapsed ? 64 : 240;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-base)" }}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <Header sidebarCollapsed={collapsed} />

      <motion.main
        animate={{
          marginLeft: isRTL ? 0 : marginValue,
          marginRight: isRTL ? marginValue : 0,
        }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="pt-16 min-h-screen"
      >
        <div className="p-6">{children}</div>
      </motion.main>
    </div>
  );
}
