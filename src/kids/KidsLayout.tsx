import Link from "next/link";
import { NavLink } from "@/shared/ui/NavLink";
import { ArrowLeft, Palette } from "lucide-react";
import { useTheme, THEMES, type ThemeDefinition } from "../core/context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState, type ReactNode } from "react";
import { UserMenu } from "../shared/ui/UserMenu";

const navItems = [
  { to: "/kids", label: "Home", emoji: "🏠", end: true },
  { to: "/kids/cs", label: "Learn CS", emoji: "💻" },
  { to: "/kids/math", label: "Math", emoji: "🔢" },
  { to: "/kids/games", label: "Games", emoji: "🎮" },
];

export default function KidsLayout({ children }: { children?: ReactNode }) {
  const { theme, setTheme, themeData } = useTheme();
  const [showThemePicker, setShowThemePicker] = useState(false);

  // Filter for kid-friendly themes + some defaults
  const kidThemes = THEMES.filter((t: ThemeDefinition) =>
    ["dark", "midnight", "sunset", "kids-ocean", "kids-green", "kids-sunset"].includes(t.id)
  );

  return (
    <div
      className="min-h-screen transition-colors duration-500"
      style={{
        backgroundColor: "var(--bg-base)",
        fontFamily: "'Nunito', 'Segoe UI', sans-serif",
      }}
    >
      {/* Navbar */}
      <header
        className="sticky top-0 z-50 shadow-lg transition-all duration-500"
        style={{
          background: themeData.isDark 
            ? "var(--bg-surface)" 
            : `linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%)`,
          borderBottom: themeData.isDark ? "1px solid var(--border)" : "none"
        }}
      >
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center gap-4">
          <Link href="/kids" className="flex items-center gap-2 flex-shrink-0">
            <span className="text-2xl">⭐</span>
            <span className="text-white font-black text-xl tracking-tight">
              Pixel<span className="text-yellow-300">Code</span>
              <span className="text-sm font-bold text-purple-200 ml-1.5">
                for Kids
              </span>
            </span>
          </Link>

          <nav className="flex items-center gap-1 ml-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                href={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-bold transition-all duration-200
                   ${isActive 
                     ? "bg-white text-purple-700 shadow-md scale-105" 
                     : "text-white/80 hover:text-white hover:bg-white/20"}`
                }
              >
                <span>{item.emoji}</span>
                <span className="hidden sm:block">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            {/* Theme Toggle */}
            <div className="relative">
              <button
                onClick={() => setShowThemePicker(!showThemePicker)}
                className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
                title="Change Theme"
              >
                <Palette className="w-5 h-5" />
              </button>

              <AnimatePresence>
                {showThemePicker && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 w-48 z-50"
                  >
                    <p className="text-xs font-black text-gray-400 mb-2 px-1 uppercase tracking-wider">Choose Theme</p>
                    <div className="grid grid-cols-2 gap-2">
                      {kidThemes.map((t: ThemeDefinition) => (
                        <button
                          key={t.id}
                          onClick={() => {
                            setTheme(t.id);
                            setShowThemePicker(false);
                          }}
                          className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all
                            ${theme === t.id ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20" : "border-transparent hover:bg-gray-50 dark:hover:bg-gray-700"}`}
                        >
                          <div 
                            className="w-8 h-8 rounded-full border border-gray-200 shadow-sm"
                            style={{ background: `linear-gradient(135deg, ${t.preview[0]} 0%, ${t.preview[1]} 100%)` }}
                          />
                          <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300">{t.label}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="h-8 w-px bg-white/20 mx-1 hidden sm:block" />

            <Link
              href="/"
              className="flex items-center gap-1.5 text-white/70 hover:text-white text-xs font-semibold transition-colors mr-2"
              title="Return to Main Site"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:block">Exit</span>
            </Link>

            <UserMenu variant="kids" />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {children}
      </main>

      <footer
        className="text-center py-6 text-sm font-bold"
        style={{ color: "var(--accent)" }}
      >
        🌟 Keep learning, keep growing! 🌟
      </footer>
    </div>
  );
}
