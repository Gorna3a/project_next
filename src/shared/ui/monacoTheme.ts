import type { editor } from "monaco-editor";
import type { ThemeDefinition } from "../../core/context/ThemeContext";

// ─── Monaco theme derived from the active global theme ───────────────────────
// Reads the theme's CSS-var map directly (source of truth — no DOM timing
// issues) and builds a `pixelcode` editor theme on top of Monaco's stock
// light/dark bases. Token colors stay stock for readability; every surface
// color (background, gutter, cursor, selection, widgets) follows the theme.

const varOf = (vars: Record<string, string>, key: string, fallback: string) =>
  vars[key] ?? fallback;

/** Append an alpha byte to a #rgb / #rrggbb hex color. Falls back as-is. */
const withAlpha = (hex: string, alpha: string): string => {
  const clean = hex.trim().replace(/^#/, "");
  if (/^[0-9a-fA-F]{6}$/.test(clean)) return `#${clean}${alpha}`;
  if (/^[0-9a-fA-F]{3}$/.test(clean)) {
    const [r, g, b] = clean.split("");
    return `#${r}${r}${g}${g}${b}${b}${alpha}`;
  }
  return hex;
};

export const PIXELCODE_MONACO_THEME = "pixelcode";

export const buildPixelcodeTheme = (theme: ThemeDefinition): editor.IStandaloneThemeData => {
  const { vars, isDark } = theme;
  const bgSurface = varOf(vars, "--bg-surface", isDark ? "#1e1e1e" : "#ffffff");
  const bgElevated = varOf(vars, "--bg-elevated", bgSurface);
  const bgSubtle = varOf(vars, "--bg-subtle", bgSurface);
  const border = varOf(vars, "--border", isDark ? "#3c3c3c" : "#d4d4d4");
  const fgPrimary = varOf(vars, "--text-primary", isDark ? "#d4d4d4" : "#1e1e1e");
  const fgMuted = varOf(vars, "--text-muted", isDark ? "#858585" : "#6e6e6e");
  const accent = varOf(vars, "--accent", isDark ? "#BFFF00" : "#A6E000");

  return {
    base: isDark ? "vs-dark" : "vs",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": bgSurface,
      "editor.foreground": fgPrimary,
      "editorGutter.background": bgSurface,
      "editorLineNumber.foreground": fgMuted,
      "editorLineNumber.activeForeground": fgPrimary,
      "editorCursor.foreground": accent,
      "editor.selectionBackground": withAlpha(accent, "40"),
      "editor.inactiveSelectionBackground": withAlpha(accent, "22"),
      "editor.lineHighlightBackground": bgSubtle,
      "editor.lineHighlightBorder": "#00000000",
      "editorWhitespace.foreground": fgMuted,
      "editorIndentGuide.background1": withAlpha(fgMuted, "35"),
      "editorIndentGuide.activeBackground1": withAlpha(fgMuted, "70"),
      "editorWidget.background": bgElevated,
      "editorWidget.border": border,
      "editorWidget.foreground": fgPrimary,
      "editorHoverWidget.background": bgElevated,
      "editorHoverWidget.border": border,
      "editorHoverWidget.foreground": fgPrimary,
      "editorSuggestWidget.background": bgElevated,
      "editorSuggestWidget.border": border,
      "editorSuggestWidget.foreground": fgPrimary,
      "editorSuggestWidget.selectedBackground": withAlpha(accent, "35"),
      "editorSuggestWidget.highlightForeground": accent,
      "editor.findMatchBackground": withAlpha(accent, "55"),
      "editor.findMatchHighlightBackground": withAlpha(accent, "30"),
      "editorBracketMatch.background": withAlpha(accent, "30"),
      "editorBracketMatch.border": withAlpha(accent, "90"),
      "editorLineNumber.dimmedForeground": withAlpha(fgMuted, "80"),
      "editorCodeLens.foreground": fgMuted,
      "editor.foldBackground": withAlpha(accent, "20"),
      "editorGutter.addedBackground": "#22c55e",
      "editorGutter.deletedBackground": "#ef4444",
      "editorGutter.modifiedBackground": accent,
      "minimap.background": withAlpha(bgSurface, "AA"),
      "scrollbarSlider.background": withAlpha(fgMuted, "55"),
      "scrollbarSlider.hoverBackground": withAlpha(fgMuted, "85"),
      "scrollbarSlider.activeBackground": withAlpha(fgMuted, "AA"),
    },
  };
};

export const MONACO_FONT_FAMILY =
  '"JetBrains Mono", "Space Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
