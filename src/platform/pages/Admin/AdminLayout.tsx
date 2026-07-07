import Link from "next/link";
import { NavLink } from "@/shared/ui/NavLink";
import { 
  LayoutDashboard, Users, Trophy, BookOpen, 
  Settings, ArrowLeft, ShieldCheck 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { type ReactNode } from 'react';

export default function AdminLayout({ children }: { children?: ReactNode }) {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/admin', end: true },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: Trophy, label: 'Challenges', path: '/admin/challenges' },
    { icon: BookOpen, label: 'Courses', path: '/admin/courses' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      {/* Admin Sidebar */}
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
            <NavLink
              key={item.path}
               href={item.path}
              end={item.end}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all
                ${isActive 
                  ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600' 
                  : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'}
              `}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
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

      {/* Main Content */}
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
