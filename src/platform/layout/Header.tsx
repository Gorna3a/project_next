'use client';

import { useState, useRef, useEffect } from "react";
import { Bell, Globe, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../core/context/ThemeContext";
import { useLanguage } from "../../core/context/LanguageContext";
import { useNotifications } from "../../core/context/NotificationContext";
import { useAuth } from "../../core/context/AuthContext";
import { UserMenu } from "../../shared/ui/UserMenu";
import { NotificationTray } from "../../shared/ui/NotificationTray";

// ─── Theme Switch (single pixel toggle, LIGHT / DARK) ─────────────────────────

const ThemeToggle = () => {
  const { themeData, setTheme } = useTheme();
  const { t } = useLanguage();
  const dark = !!themeData.isDark;
  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      onClick={() => setTheme(dark ? "light" : "dark")}
      className="theme-switch"
      aria-label={`${t('common.changeTheme')}: ${dark ? 'DARK' : 'LIGHT'}`}
      title={`${t('common.changeTheme')}: ${dark ? 'DARK' : 'LIGHT'}`}
    >
      <span className="ts-track" aria-hidden="true"><span className="ts-thumb" /></span>
      <span className="ts-label">{dark ? 'DARK' : 'LIGHT'}</span>
    </button>
  );
};

// ─── Language Menu ────────────────────────────────────────────────────────────

const LanguageMenu = () => {
  const { language, setLanguage, isRTL, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="px-3 py-1.5 bg-brand-500 text-white rounded-xl flex items-center gap-2 text-xs font-bold shadow-lg shadow-brand-500/20 hover:bg-brand-600 transition-all active:scale-95"
        aria-label={t('common.changeLanguage')}
        title={t('common.changeLanguage')}
      >
        <Globe className="w-4 h-4" />
        <span className="uppercase">{language}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-full mt-2 z-50 rounded-2xl shadow-xl border p-2 min-w-[120px]`}
            style={{
              backgroundColor: "var(--bg-elevated)",
              borderColor: "var(--border)",
            }}
          >
            {[
              { id: 'en', label: 'English', flag: '🇺🇸' },
              { id: 'ar', label: 'العربية', flag: '🇸🇦' },
            ].map((lang) => (
              <button
                key={lang.id}
                onClick={() => {
                  setLanguage(lang.id as any);
                  setOpen(false);
                }}
                className={`flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-bold transition-all
                  ${language === lang.id ? 'bg-brand-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
              >
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Header ───────────────────────────────────────────────────────────────────

interface HeaderProps {
  sidebarCollapsed: boolean;
}

export const Header = ({ sidebarCollapsed }: HeaderProps) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const { unreadCount } = useNotifications();
  const { isRTL, t } = useLanguage();
  const { profile } = useAuth();
  const totalXP = profile?.totalXP ?? 0;

  return (
    <motion.header
      animate={{ 
        left: isRTL ? 0 : (sidebarCollapsed ? 64 : 230),
        right: isRTL ? (sidebarCollapsed ? 64 : 230) : 0
      }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="topbar"
      style={{
        position: "fixed",
        top: 0,
        height: 56,
        zIndex: 30,
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "0 16px",
        backgroundColor: "var(--surface)",
        borderBottom: "4px solid var(--border)",
      } as any}
    >
      <div className="flex-1" />

      <div className="flex items-center gap-2">
        <div
          className="xp-chip"
          title={`${totalXP.toLocaleString()} ${t('common.xp')}`}
          aria-label={`${totalXP.toLocaleString()} ${t('common.xp')}`}
        >
          <Zap strokeWidth={3} fill="currentColor" aria-hidden="true" />
          <span className="xp-num">{totalXP.toLocaleString()}</span>
          <span className="xp-tag">XP</span>
        </div>

        <LanguageMenu />
        <ThemeToggle />

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2 rounded-xl transition-colors relative
              ${showNotifications ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500'}`}
            aria-label={t('common.notifications')}
            title={t('common.notifications')}
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className={`absolute top-2 ${isRTL ? 'left-2' : 'right-2'} w-2 h-2 bg-brand-500 rounded-full border-2 border-white dark:border-gray-900`} />
            )}
          </button>
          
          <NotificationTray 
            isOpen={showNotifications} 
            onClose={() => setShowNotifications(false)} 
          />
        </div>

        <UserMenu variant="platform" />
      </div>
    </motion.header>
  );
};
