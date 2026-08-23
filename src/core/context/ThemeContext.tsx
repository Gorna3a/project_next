'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { AppTheme } from "../types";

// New retro theme — “Beige Computer” light + “Phosphor Night” dark from pixelcode-retro.html
const THEME_LOCKED = false;
const LOCKED_THEME: AppTheme = "neobrutalism";

// ─── Theme definitions ────────────────────────────────────────────────────────

export interface ThemeDefinition {
  id: AppTheme;
  label: string;
  isDark: boolean;
  preview: string[]; // 3 hex colors for the swatch preview
  description: string;
  // CSS variable values applied to :root when this theme is active
  vars: Record<string, string>;
}

export const THEMES: ThemeDefinition[] = [
  {
    id: "light",
    label: "Beige Computer",
    isDark: false,
    preview: ["#D6CFBC", "#A6E000", "#161616"],
    description: "Retro beige CRT — phosphor #A6E000 on #D6CFBC shell",
    vars: {
      "--bg-base": "#D6CFBC",
      "--bg-surface": "#EFE9D9",
      "--bg-elevated": "#EFE9D9",
      "--bg-subtle": "#CFC8B5",
      "--border": "#161616",
      "--border-subtle": "#161616",
      "--text-primary": "#161616",
      "--text-secondary": "#6B6560",
      "--text-muted": "#8A867F",
      "--accent": "#A6E000",
      "--accent-hover": "#7AA800",
      "--accent-subtle": "#EFE9D9",
      "--accent-text": "#161616",
      "--bg-sidebar": "#EFE9D9",
      "--bg-header": "#EFE9D9",
      "--particle-opacity": "0",
      "--orange": "#FF6B1A",
      "--yellow": "#FFE600",
      "--blue": "#7AA8FF",
      "--grey": "#8A867F",
      "--phosphor": "#A6E000",
      "--phosphor2": "#7AA800",
    },
  },
  {
    id: "dark",
    label: "Phosphor Night",
    isDark: true,
    preview: ["#0F100E", "#BFFF00", "#E8FFD0"],
    description: "True phosphor-dark CRT at night — #BFFF00 on #0F100E",
    vars: {
      "--bg-base": "#0F100E",
      "--bg-surface": "#1C1E1A",
      "--bg-elevated": "#1C1E1A",
      "--bg-subtle": "#242720",
      "--border": "#1A1F14",
      "--border-subtle": "#1A1F14",
      "--text-primary": "#E8FFD0",
      "--text-secondary": "#9AB08A",
      "--text-muted": "#6E7D5E",
      "--accent": "#BFFF00",
      "--accent-hover": "#9ED500",
      "--accent-subtle": "#1C1E1A",
      "--accent-text": "#0F100E",
      "--bg-sidebar": "#1C1E1A",
      "--bg-header": "#1C1E1A",
      "--particle-opacity": "0",
      "--orange": "#FF6B1A",
      "--yellow": "#FFE600",
      "--blue": "#7AA8FF",
      "--grey": "#8A867F",
      "--phosphor": "#BFFF00",
      "--phosphor2": "#9ED500",
    },
  },
  {
    id: "midnight",
    label: "Midnight",
    isDark: true,
    preview: ["#0d1117", "#38bdf8", "#c9e8ff"],
    description: "Deep navy blue — inspired by the night sky",
    vars: {
      "--bg-base": "#0d1117",
      "--bg-surface": "#161b22",
      "--bg-elevated": "#21262d",
      "--bg-subtle": "#1c2128",
      "--border": "#30363d",
      "--border-subtle": "#21262d",
      "--text-primary": "#e6edf3",
      "--text-secondary": "#8b949e",
      "--text-muted": "#484f58",
      "--accent": "#38bdf8",
      "--accent-hover": "#7dd3fc",
      "--accent-subtle": "#0c1e2e",
      "--accent-text": "#38bdf8",
      "--bg-sidebar": "#161b22",
      "--bg-header": "#161b22",
      "--particle-opacity": "0.2",
    },
  },
  {
    id: "sunset",
    label: "Sunset",
    isDark: true,
    preview: ["#1a0e2e", "#f472b6", "#ffe4f0"],
    description: "Warm purple haze — a cozy evening coding session",
    vars: {
      "--bg-base": "#1a0e2e",
      "--bg-surface": "#241535",
      "--bg-elevated": "#2e1a40",
      "--bg-subtle": "#200f38",
      "--border": "#3d2258",
      "--border-subtle": "#2d1848",
      "--text-primary": "#f5e6ff",
      "--text-secondary": "#c49ed4",
      "--text-muted": "#7a5490",
      "--accent": "#f472b6",
      "--accent-hover": "#fb7ac9",
      "--accent-subtle": "#2d1040",
      "--accent-text": "#f472b6",
      "--bg-sidebar": "#241535",
      "--bg-header": "#241535",
      "--particle-opacity": "0.2",
    },
  },
  {
    id: "nord",
    label: "Nord",
    isDark: true,
    preview: ["#2e3440", "#88c0d0", "#d8dee9"],
    description: "Arctic and calm — the Scandinavian developer palette",
    vars: {
      "--bg-base": "#2e3440",
      "--bg-surface": "#3b4252",
      "--bg-elevated": "#434c5e",
      "--bg-subtle": "#3b4252",
      "--border": "#4c566a",
      "--border-subtle": "#434c5e",
      "--text-primary": "#eceff4",
      "--text-secondary": "#d8dee9",
      "--text-muted": "#9099a9",
      "--accent": "#88c0d0",
      "--accent-hover": "#8fbcbb",
      "--accent-subtle": "#2e3a47",
      "--accent-text": "#88c0d0",
      "--bg-sidebar": "#3b4252",
      "--bg-header": "#3b4252",
      "--particle-opacity": "0.2",
    },
  },
  {
    id: "kids-ocean",
    label: "Ocean",
    isDark: false,
    preview: ["#e0f2fe", "#0ea5e9", "#0369a1"],
    description: "Bright and bubbly ocean theme for kids!",
    vars: {
      "--bg-base": "#e0f2fe",
      "--bg-surface": "#ffffff",
      "--bg-elevated": "#f0f9ff",
      "--bg-subtle": "#f8fafc",
      "--border": "#bae6fd",
      "--border-subtle": "#e0f2fe",
      "--text-primary": "#0c4a6e",
      "--text-secondary": "#0369a1",
      "--text-muted": "#0ea5e9",
      "--accent": "#0ea5e9",
      "--accent-hover": "#38bdf8",
      "--accent-subtle": "#e0f2fe",
      "--accent-text": "#0ea5e9",
      "--bg-sidebar": "#ffffff",
      "--bg-header": "#ffffff",
      "--particle-opacity": "0.4",
    },
  },
  {
    id: "kids-green",
    label: "Nature",
    isDark: false,
    preview: ["#f0fdf4", "#22c55e", "#15803d"],
    description: "Fresh and green forest theme for kids!",
    vars: {
      "--bg-base": "#f0fdf4",
      "--bg-surface": "#ffffff",
      "--bg-elevated": "#f8fafc",
      "--bg-subtle": "#f0fdf4",
      "--border": "#bbf7d0",
      "--border-subtle": "#dcfce7",
      "--text-primary": "#14532d",
      "--text-secondary": "#15803d",
      "--text-muted": "#22c55e",
      "--accent": "#22c55e",
      "--accent-hover": "#4ade80",
      "--accent-subtle": "#dcfce7",
      "--accent-text": "#22c55e",
      "--bg-sidebar": "#ffffff",
      "--bg-header": "#ffffff",
      "--particle-opacity": "0.4",
    },
  },
  {
    id: "kids-sunset",
    label: "Sunset",
    isDark: false,
    preview: ["#fffbeb", "#f59e0b", "#92400e"],
    description: "Warm and happy sunset theme for kids!",
    vars: {
      "--bg-base": "#fffbeb",
      "--bg-surface": "#ffffff",
      "--bg-elevated": "#fff7ed",
      "--bg-subtle": "#fffbeb",
      "--border": "#fde68a",
      "--border-subtle": "#fef3c7",
      "--text-primary": "#78350f",
      "--text-secondary": "#92400e",
      "--text-muted": "#f59e0b",
      "--accent": "#f59e0b",
      "--accent-hover": "#fbbf24",
      "--accent-subtle": "#fef3c7",
      "--accent-text": "#f59e0b",
      "--bg-sidebar": "#ffffff",
      "--bg-header": "#ffffff",
      "--particle-opacity": "0.4",
    },
  },
  {
    id: "neobrutalism",
    label: "Neo-Brutalism",
    isDark: false,
    preview: ["#D6CFBC", "#A6E000", "#161616"],
    description: "Retro computer — same as Beige Computer, hard brutalism",
    vars: {
      "--bg-base": "#D6CFBC",
      "--bg-surface": "#EFE9D9",
      "--bg-elevated": "#EFE9D9",
      "--bg-subtle": "#CFC8B5",
      "--border": "#161616",
      "--border-subtle": "#161616",
      "--text-primary": "#161616",
      "--text-secondary": "#6B6560",
      "--text-muted": "#8A867F",
      "--accent": "#A6E000",
      "--accent-hover": "#7AA800",
      "--accent-subtle": "#EFE9D9",
      "--accent-text": "#161616",
      "--bg-sidebar": "#EFE9D9",
      "--bg-header": "#EFE9D9",
      "--particle-opacity": "0",
      "--orange": "#FF6B1A",
      "--yellow": "#FFE600",
      "--blue": "#7AA8FF",
      "--grey": "#8A867F",
      "--phosphor": "#A6E000",
      "--phosphor2": "#7AA800",
    },
  },
];

// ─── Context ──────────────────────────────────────────────────────────────────

interface ThemeContextValue {
  theme: AppTheme;
  themeData: ThemeDefinition;
  setTheme: (theme: AppTheme) => void;
  resolvedTheme: AppTheme; // same as theme unless 'system'
  customTheme: ThemeDefinition | null;
  saveCustomTheme: (def: ThemeDefinition) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

// ─── Apply theme to DOM ───────────────────────────────────────────────────────

const getSystemPreferred = (): AppTheme =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

const applyTheme = (themeDef: ThemeDefinition) => {
  const root = document.documentElement;

  // Set data-theme attribute for CSS selectors
  root.setAttribute("data-theme", themeDef.id);

  // Apply all CSS variables
  Object.entries(themeDef.vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });

  // Toggle dark class for Tailwind dark: variants
  if (themeDef.isDark) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
};

// ─── Provider ─────────────────────────────────────────────────────────────────

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<AppTheme>(() => {
    if (THEME_LOCKED) return LOCKED_THEME;
    if (typeof window !== "undefined") {
      return (localStorage.getItem("pixelcode-theme") as AppTheme) || "neobrutalism";
    }
    return "neobrutalism";
  });

  const [customTheme, setCustomTheme] = useState<ThemeDefinition | null>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("pixelcode-custom-theme");
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });

  const resolved: AppTheme = THEME_LOCKED ? LOCKED_THEME : (theme === "system" ? getSystemPreferred() : theme);

  // Keep storage in sync so a refresh doesn't flash the old theme
  useEffect(() => {
    if (THEME_LOCKED) localStorage.setItem("pixelcode-theme", LOCKED_THEME);
  }, []);

  let themeData: ThemeDefinition;
  if (resolved === 'custom' && customTheme) {
    themeData = customTheme;
  } else {
    themeData = THEMES.find((t) => t.id === resolved) ?? THEMES[1];
  }

  useEffect(() => {
    applyTheme(themeData);
  }, [themeData]);

  // System theme listener
  useEffect(() => {
    if (theme !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const sys = getSystemPreferred();
      const def = THEMES.find((t) => t.id === sys) ?? THEMES[1];
      applyTheme(def);
    };
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [theme]);

  const setTheme = (newTheme: AppTheme) => {
    if (THEME_LOCKED) {
      localStorage.setItem("pixelcode-theme", LOCKED_THEME);
      setThemeState(LOCKED_THEME);
      return;
    }
    setThemeState(newTheme);
    localStorage.setItem("pixelcode-theme", newTheme);
  };

  const saveCustomTheme = (def: ThemeDefinition) => {
    setCustomTheme(def);
    localStorage.setItem("pixelcode-custom-theme", JSON.stringify(def));
    setTheme('custom');
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeData,
        setTheme,
        resolvedTheme: resolved,
        customTheme,
        saveCustomTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
};
