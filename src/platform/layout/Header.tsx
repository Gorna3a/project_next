'use client';

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Bell, Search, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme, THEMES } from "../../core/context/ThemeContext";
import { useLanguage } from "../../core/context/LanguageContext";
import { useNotifications } from "../../core/context/NotificationContext";
import { UserMenu } from "../../shared/ui/UserMenu";
import { NotificationTray } from "../../shared/ui/NotificationTray";
import { UserSearch } from "../../shared/ui/UserSearch";

// ─── Theme Menu ───────────────────────────────────────────────────────────────

const ThemeMenu = () => {
  const { theme, setTheme, themeData } = useTheme();
  const { isRTL, t } = useLanguage();
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
        className="btn-ghost p-2 rounded-xl flex items-center gap-1.5 text-xs"
        aria-label={t('common.changeTheme')}
        title={`${t('common.settings')}: ${themeData.label}`}
      >
        <div className="flex gap-0.5">
          {themeData.preview.map((color, i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-full mt-2 z-50 rounded-2xl shadow-xl border p-3`}
            style={{
              width: "260px",
              backgroundColor: "var(--bg-elevated)",
              borderColor: "var(--border)",
            }}
          >
            <p
              className={`text-xs font-semibold mb-3 px-1 ${isRTL ? 'text-right' : 'text-left'}`}
              style={{ color: "var(--text-muted)" }}
            >
              {t('common.changeTheme').toUpperCase()}
            </p>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {["light", "dark", "midnight"].map((id) => {
                const themeItem = THEMES.find((th) => th.id === id);
                if (!themeItem) return null;
                return (
                  <button
                    key={id}
                    onClick={() => {
                      setTheme(id as any);
                      setOpen(false);
                    }}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all
                      ${theme === id ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20" : "border-transparent hover:bg-gray-100 dark:hover:bg-gray-800"}`}
                  >
                    <div 
                      className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700"
                      style={{ background: `linear-gradient(135deg, ${themeItem.preview[0]} 0%, ${themeItem.preview[1]} 100%)` }}
                    />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{themeItem.label}</span>
                  </button>
                );
              })}
            </div>
            <Link
              href="/app/settings"
              onClick={() => setOpen(false)}
              className={`flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-brand-600 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              {isRTL ? 'المزيد من السمات ←' : 'More Themes →'}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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
  const [showSearch, setShowSearch] = useState(false);
  const { unreadCount } = useNotifications();
  const { isRTL, t } = useLanguage();

  return (
    <motion.header
      animate={{ 
        left: isRTL ? 0 : (sidebarCollapsed ? 64 : 240),
        right: isRTL ? (sidebarCollapsed ? 64 : 240) : 0
      }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="fixed top-0 h-16 backdrop-blur-md border-b flex items-center px-6 gap-4 z-30 shadow-sm"
      style={{
        backgroundColor: "var(--bg-header)",
        borderColor: "var(--border)",
      }}
    >
      <div className="flex-1" />

      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowSearch(true)}
          className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label={t('common.searchUsers')}
          title={t('common.searchUsers')}
        >
          <Search className="w-4 h-4" />
        </button>

        <LanguageMenu />
        <ThemeMenu />

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

      <UserSearch isOpen={showSearch} onClose={() => setShowSearch(false)} />
    </motion.header>
  );
};
