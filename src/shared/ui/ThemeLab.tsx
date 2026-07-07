'use client';

import { useState } from "react";
import { Save, RefreshCcw, Eye } from "lucide-react";
import { useTheme } from "../../core/context/ThemeContext";

const PRESET_COLORS = [
  "#4f54ea", "#6272f5", "#38bdf8", "#0ea5e9", "#22c55e", "#f59e0b", "#f472b6", "#ef4444"
];

export const ThemeLab = () => {
  const { themeData, saveCustomTheme } = useTheme();

  const [accent, setAccent] = useState(themeData.vars["--accent"] || "#4f54ea");
  const [bg, setBg] = useState(themeData.vars["--bg-base"] || "#0a0a0f");
  const [sidebarBg, setSidebarBg] = useState(themeData.vars["--bg-sidebar"] || "#13131f");
  const [headerBg, setHeaderBg] = useState(themeData.vars["--bg-header"] || "#13131f");
  const [isDark, setIsDark] = useState(themeData.isDark);

  const handleSave = () => {
    // Generate theme vars
    const vars = {
      "--bg-base": bg,
      "--bg-surface": isDark ? "#13131f" : "#ffffff",
      "--bg-elevated": isDark ? "#1a1a2e" : "#ffffff",
      "--bg-subtle": isDark ? "#16162a" : "#eef0f8",
      "--bg-sidebar": sidebarBg,
      "--bg-header": headerBg,
      "--border": isDark ? "#2a2a45" : "#e2e4f0",
      "--border-subtle": isDark ? "#1e1e38" : "#eef0f8",
      "--text-primary": isDark ? "#e8e8ff" : "#0f0f1a",
      "--text-secondary": isDark ? "#9395c8" : "#5a5c7a",
      "--text-muted": isDark ? "#5a5c90" : "#9395b0",
      "--accent": accent,
      "--accent-hover": accent,
      "--accent-subtle": isDark ? `${accent}15` : `${accent}10`,
      "--accent-text": accent,
      "--particle-opacity": "0.25",
    };

    saveCustomTheme({
      id: "custom" as any,
      label: "My Custom Theme",
      isDark,
      preview: [bg, accent, sidebarBg],
      description: "Custom theme created in Theme Lab",
      vars,
    });
  };

  return (
    <div className="space-y-8 p-6 bg-white dark:bg-gray-950 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl">
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Controls */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Accent Color</h3>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setAccent(c)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${accent === c ? 'scale-110 border-gray-900 dark:border-white shadow-lg' : 'border-transparent'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
              <input
                type="color"
                value={accent}
                onChange={e => setAccent(e.target.value)}
                className="w-8 h-8 rounded-full overflow-hidden bg-transparent cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Base Background</h3>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={bg}
                  onChange={e => setBg(e.target.value)}
                  className="w-10 h-10 rounded-xl overflow-hidden bg-transparent cursor-pointer border-2 border-gray-100 dark:border-gray-800"
                />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-tighter">{bg}</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Sidebar Color</h3>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={sidebarBg}
                  onChange={e => setSidebarBg(e.target.value)}
                  className="w-10 h-10 rounded-xl overflow-hidden bg-transparent cursor-pointer border-2 border-gray-100 dark:border-gray-800"
                />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-tighter">{sidebarBg}</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Header Color</h3>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={headerBg}
                  onChange={e => setHeaderBg(e.target.value)}
                  className="w-10 h-10 rounded-xl overflow-hidden bg-transparent cursor-pointer border-2 border-gray-100 dark:border-gray-800"
                />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-tighter">{headerBg}</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Mode</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsDark(true)}
                  className={`flex-1 py-2.5 rounded-xl border-2 font-black text-[9px] uppercase tracking-widest transition-all
                      ${isDark ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-600' : 'border-gray-100 dark:border-gray-800'}`}
                >
                  Dark
                </button>
                <button
                  onClick={() => setIsDark(false)}
                  className={`flex-1 py-2.5 rounded-xl border-2 font-black text-[9px] uppercase tracking-widest transition-all
                      ${!isDark ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-600' : 'border-gray-100 dark:border-gray-800'}`}
                >
                  Light
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
            <Eye className="w-3 h-3" /> Interface Preview
          </h3>
          <div
            className="rounded-3xl border border-gray-100 dark:border-gray-800 shadow-2xl transition-all duration-300 overflow-hidden relative flex h-[320px]"
            style={{ backgroundColor: bg }}
          >
            {/* Mock Sidebar */}
            <div className="w-16 sm:w-20 border-r border-gray-100 dark:border-gray-800/50 flex flex-col items-center py-4 gap-4" style={{ backgroundColor: sidebarBg }}>
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: accent }} />
              </div>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-8 h-8 rounded-lg bg-white/5 border border-white/5" />
              ))}
            </div>

            {/* Mock Content Area */}
            <div className="flex-1 flex flex-col">
              {/* Mock Header */}
              <div className="h-10 border-b border-gray-100 dark:border-gray-800/50 flex items-center justify-end px-4 gap-2" style={{ backgroundColor: headerBg }}>
                <div className="w-4 h-4 rounded-full bg-white/10" />
                <div className="w-6 h-4 rounded-lg bg-white/10" />
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <h4 className="text-lg font-black" style={{ color: isDark ? '#e8e8ff' : '#0f0f1a' }}>Dashboard</h4>
                  <p className="text-[10px] leading-relaxed max-w-[180px]" style={{ color: isDark ? '#9395c8' : '#5a5c7a' }}>
                    This preview shows how your colors interact across the layout.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest text-white shadow-lg" style={{ backgroundColor: accent }}>
                    Action
                  </button>
                  <button className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border" style={{ borderColor: isDark ? '#2a2a45' : '#e2e4f0', color: isDark ? '#e8e8ff' : '#0f0f1a' }}>
                    Ghost
                  </button>
                </div>
                {/* Mock Card */}
                <div className="p-4 rounded-2xl border" style={{ backgroundColor: isDark ? '#13131f' : '#ffffff', borderColor: isDark ? '#2a2a45' : '#e2e4f0' }}>
                  <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-800 mb-2" />
                  <div className="w-2/3 h-2 rounded-full bg-gray-100 dark:bg-gray-800" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row justify-end gap-4">
        <button
          onClick={() => {
            setAccent("#6272f5");
            setBg("#0a0a0f");
            setSidebarBg("#13131f");
            setHeaderBg("#13131f");
            setIsDark(true);
          }}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <RefreshCcw className="w-4 h-4" /> Reset to Default
        </button>
        <button
          onClick={handleSave}
          className="btn-primary px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-brand-500/20"
        >
          <Save className="w-4 h-4" /> Save & Apply Custom Theme
        </button>
      </div>
    </div>
  );
};
