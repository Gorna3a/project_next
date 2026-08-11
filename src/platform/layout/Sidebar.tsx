import { type ComponentType } from "react";
import { NavLink } from "../../shared/ui/NavLink";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  Terminal,
  GraduationCap,
  Bot,
  Library,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sword,
  Trophy,
  ShieldCheck,
  Users,
  Globe,
} from "lucide-react";
import { Logo } from "../../shared/ui/Logo";
import { useAuth } from "../../core/context/AuthContext";
import { useLanguage } from "../../core/context/LanguageContext";

interface NavItem {
  to: string;
  labelKey: string;
  icon: ComponentType<{ className?: string }>;
}

export const Sidebar = ({ collapsed, onToggle }: SidebarProps) => {
  const { profile } = useAuth();
  const { t, isRTL, language, setLanguage } = useLanguage();
  const isAdmin = profile?.role === "admin";

  const mainItems: NavItem[] = [
    { to: "/app", labelKey: "nav.dashboard", icon: LayoutDashboard },
    { to: "/app/courses", labelKey: "nav.courses", icon: BookOpen },
    { to: "/app/ide", labelKey: "nav.ide", icon: Terminal },
    { to: "/app/arena", labelKey: "nav.arena", icon: Sword },
    { to: "/app/arena/rankings", labelKey: "nav.arena", icon: Trophy },
    { to: "/app/profile", labelKey: "nav.community", icon: Users },
    { to: "/app/classroom", labelKey: "nav.classroom", icon: GraduationCap },
    { to: "/app/chat", labelKey: "nav.chat", icon: Bot },
    { to: "/app/library", labelKey: "nav.library", icon: Library },
  ];

  const bottomItems: NavItem[] = [
    { to: "/app/profile", labelKey: "nav.profile", icon: User },
    { to: "/app/settings", labelKey: "nav.settings", icon: Settings },
  ];

  const renderItem = (item: NavItem) => {
    const label = t(item.labelKey);
    return (
      <li key={item.to}>
        <NavLink
          href={item.to}
          end={item.to === "/app"}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative
             ${
               isActive
                 ? "bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-400"
                 : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
             }`
          }
        >
          <item.icon className="w-5 h-5 flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden whitespace-nowrap"
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>

          {/* Tooltip when collapsed */}
          {collapsed && (
            <div
              className={`absolute ${isRTL ? 'right-full mr-3' : 'left-full ml-3'} px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg
                            opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50`}
            >
              {label}
            </div>
          )}
        </NavLink>
      </li>
    );
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className={`fixed top-0 ${isRTL ? 'right-0 border-l' : 'left-0 border-r'} h-full flex flex-col z-40 overflow-hidden`}
      style={{
        backgroundColor: "var(--bg-sidebar)",
        borderColor: "var(--border)",
      }}
    >
      {/* Logo area */}
      <div
        className="h-16 flex items-center px-3 border-b flex-shrink-0"
        style={{ borderColor: "var(--border)" }}
      >
        {collapsed ? (
          <div className="w-7 h-7 grid grid-cols-2 gap-0.5 mx-auto">
            <div className="bg-brand-500 rounded-[2px]" />
            <div className="bg-brand-300 rounded-[2px]" />
            <div className="bg-brand-300 rounded-[2px]" />
            <div className="bg-brand-600 rounded-[2px]" />
          </div>
        ) : (
          <Logo linkTo="/app" />
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-4">
        <ul className="space-y-1">{mainItems.map(renderItem)}</ul>

        {isAdmin && (
          <>
            <div
              className="my-4 border-t"
              style={{ borderColor: "var(--border)" }}
            />
            <ul className="space-y-1">
              {renderItem({ to: "/admin", labelKey: "nav.admin", icon: ShieldCheck })}
            </ul>
          </>
        )}

        <div
          className="my-4 border-t"
          style={{ borderColor: "var(--border)" }}
        />

        <ul className="space-y-1">{bottomItems.map(renderItem)}</ul>
      </nav>

      {/* Sidebar footer */}
      <div
        className="p-2 border-t flex-shrink-0 flex items-center gap-2"
        style={{ borderColor: "var(--border)" }}
      >
        <button
          onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-brand-600 transition-colors border border-dashed border-gray-200 dark:border-gray-800"
          title={t('common.changeLanguage')}
        >
          <Globe className="w-3.5 h-3.5" />
          {!collapsed && <span>{language}</span>}
        </button>

        <button
          onClick={onToggle}
          className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          aria-label={collapsed ? t('common.expandSidebar') : t('common.collapseSidebar')}
          title={collapsed ? t('common.expandSidebar') : t('common.collapseSidebar')}
        >
          {collapsed ? (
            isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
          ) : (
            isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>
    </motion.aside>
  );
};

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}
