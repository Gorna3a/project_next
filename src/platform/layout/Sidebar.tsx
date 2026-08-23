import { type ComponentType } from "react";
import { NavLink } from "../../shared/ui/NavLink";
import { motion } from "framer-motion";
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
import { useTheme } from "../../core/context/ThemeContext";

interface NavItem {
  to: string;
  labelKey: string;
  icon: ComponentType<{ className?: string }>;
}

export const Sidebar = ({ collapsed, onToggle }: SidebarProps) => {
  const { profile } = useAuth();
  const { t, isRTL, language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
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
            `nav-item ${isActive ? "active" : ""} ${collapsed ? "justify-center px-2" : ""}`
          }
        >
          <item.icon className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>{label}</span>}
          {collapsed && (
            <div className={`absolute ${isRTL ? 'right-full mr-3' : 'left-full ml-3'} px-2 py-1 bg-black text-white text-xs border-[2px] border-black opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 font-mono`}>
              {label}
            </div>
          )}
        </NavLink>
      </li>
    );
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 230 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className={`sidebar fixed top-0 ${isRTL ? 'right-0' : 'left-0'} h-screen flex flex-col z-40 overflow-hidden`}
      style={{ borderRight: isRTL ? 'none' : '4px solid var(--border)', borderLeft: isRTL ? '4px solid var(--border)' : 'none' }}
    >
      {/* Head — 64px, border 4px, surface2, LEDs, resized logo */}
      <div className="side-head">
        <div className="logo-box" style={{ width: 44, height: 30 }}>
          {collapsed ? (
            <div className="w-full h-full grid place-items-center bg-black text-[var(--phosphor)] font-mono text-[8px] font-black">PC</div>
          ) : (
            <div style={{ transform: 'scale(0.82)', transformOrigin: 'center' }}>
              <Logo linkTo="/app" size="sm" />
            </div>
          )}
        </div>
        {!collapsed && (
          <>
            <div style={{ fontFamily: "'Press Start 2P'", fontSize: 8, lineHeight: 1.1 }}>
              PIXEL<br /><span style={{ color: 'var(--phosphor)' }}>CODE</span>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
              <span className="led" />
              <span className="led" style={{ background: 'var(--phosphor)', animationDelay: '0.3s' } as any} />
            </div>
          </>
        )}
      </div>

      <nav className="side-nav">
        <ul className="space-y-1">{mainItems.map(renderItem)}</ul>
        {isAdmin && (
          <>
            <div className="nav-divider" />
            <ul className="space-y-1">{renderItem({ to: "/admin", labelKey: "nav.admin", icon: ShieldCheck })}</ul>
          </>
        )}
        <div className="nav-divider" />
        <ul className="space-y-1">{bottomItems.map(renderItem)}</ul>
      </nav>

      <div className="side-foot">
        {!collapsed && (
          <>
            <div className="mono" style={{ fontSize: 8, fontWeight: 800, letterSpacing: '0.08em' }}>THEME</div>
            <div className="theme-row">
              <button onClick={() => setTheme('light' as any)} className={`theme-btn ${theme === 'light' ? 'on' : 'off'}`}>LIGHT</button>
              <button onClick={() => setTheme('dark' as any)} className={`theme-btn ${theme === 'dark' ? 'on' : 'off'}`}>DARK</button>
            </div>
          </>
        )}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 border-[3px] border-black bg-white text-black font-mono text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
            title={t('common.changeLanguage')}
          >
            <Globe className="w-3 h-3" />
            {!collapsed && language.toUpperCase()}
          </button>
          <button
            onClick={onToggle}
            className="p-1.5 border-[3px] border-black bg-white text-black hover:bg-black hover:text-white transition-colors"
            aria-label={collapsed ? t('common.expandSidebar') : t('common.collapseSidebar')}
          >
            {collapsed ? (isRTL ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />) : (isRTL ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />)}
          </button>
        </div>
      </div>
    </motion.aside>
  );
};

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}
