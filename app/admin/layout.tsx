'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Trophy, BookOpen,
  Settings, ArrowLeft, ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/core/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { profile, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!profile || profile.role !== "admin")) {
      router.replace("/app");
    }
  }, [profile, loading, router]);

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

  if (!profile || profile.role !== "admin") return null;

  const menuItems = [
    { icon: LayoutDashboard, label: "Overview", path: "/admin", end: true },
    { icon: Users, label: "Users", path: "/admin/users" },
    { icon: Trophy, label: "Challenges", path: "/admin/challenges" },
    { icon: BookOpen, label: "Courses", path: "/admin/courses" },
    { icon: Settings, label: "Settings", path: "/admin/settings" },
  ];

  const isLinkActive = (path: string, end?: boolean) => {
    if (end) return pathname === path;
    return pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      <aside className="w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-black text-sm tracking-tight">ADMIN PANEL</h1>
            <p className="text-[10px] font-black text-indigo-500 uppercase">PixelCode Master</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all
                ${isLinkActive(item.path, item.end)
                  ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600"
                  : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <Link
            href="/app"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Platform
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <header className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-8">
          <div className="md:hidden">
            <ShieldCheck className="w-6 h-6 text-indigo-600" />
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-black">Admin Mode</div>
              <div className="text-[10px] text-gray-400 font-medium">Session Active</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-sm">👑</div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
