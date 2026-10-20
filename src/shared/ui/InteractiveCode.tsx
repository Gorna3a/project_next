'use client';

// ── Snippet design (reusable) ─────────────────────────────────────────────────
// Every lesson code snippet follows this two-layer look:
//   1. a cream "robot face" plate — the site's light palette, black pixel border,
//      stepped corners and a hard offset shadow (the background);
//   2. a dark "pixelated editor" — the site's dark palette, pixel frame, three
//      pixel "eyes" (red/yellow/green) and a Press Start 2P Run button.
// Keep new snippets on this pattern.

import { useEffect, useRef, useState, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import type { Monaco } from '@monaco-editor/react';
import { Loader2, Play, RotateCcw } from 'lucide-react';
import { useLanguage } from '../../core/context/LanguageContext';
import { CANONICAL_DARK_THEME, CANONICAL_LIGHT_THEME, type ThemeDefinition } from '../../core/context/ThemeContext';
import { LANGUAGES, runCode, type CompileResult } from '../../core/services/compiler';
import {
  PIXELCODE_CODEBLOCK_THEME,
  MONACO_FONT_FAMILY,
  buildCodeBlockTheme,
} from './monacoTheme';

// Pixel-art corner cut (two 6px steps) applied to the snippet frame so it reads
// as a retro/robot terminal rather than a rounded modern card.
const PIXEL_CORNER_CLIP =
  'polygon(' +
  '0 12px, 6px 12px, 6px 6px, 12px 6px, 12px 0, ' +
  'calc(100% - 12px) 0, calc(100% - 12px) 6px, calc(100% - 6px) 6px, calc(100% - 6px) 12px, 100% 12px, ' +
  '100% calc(100% - 12px), calc(100% - 6px) calc(100% - 12px), calc(100% - 6px) calc(100% - 6px), calc(100% - 12px) calc(100% - 6px), calc(100% - 12px) 100%, ' +
  '12px 100%, 12px calc(100% - 6px), 6px calc(100% - 6px), 6px calc(100% - 12px), 0 calc(100% - 12px)' +
  ')';

const PIXEL_FONT = "'Press Start 2P', monospace";
const SHADOW_COLOR = 'rgba(0,0,0,0.45)';

// Monaco is loaded client-side only. The lesson page (and the shared Markdown
// renderer) are client components, so this keeps the heavy editor chunk out of
// server rendering and out of pages that never render interactive code.
const MonacoEditor = dynamic(
  () => import('@monaco-editor/react').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div
        className="h-44 grid place-items-center text-xs"
        style={{ color: '#8b8ba0', backgroundColor: '#0a0a0f', fontFamily: PIXEL_FONT }}
      >
        LOADING…
      </div>
    ),
  },
);

/** Map a Markdown fence language (js, py, …) to a Judge0 language key. */
const LANG_ALIASES: Record<string, string> = {
  js: 'javascript', javascript: 'javascript', mjs: 'javascript', cjs: 'javascript', node: 'javascript',
  ts: 'typescript', typescript: 'typescript',
  py: 'python', python: 'python',
  java: 'java',
  c: 'c', h: 'c',
  cpp: 'cpp', 'c++': 'cpp', cxx: 'cpp', cc: 'cpp', hpp: 'cpp',
  go: 'go', golang: 'go',
  rs: 'rust', rust: 'rust',
  kt: 'kotlin', kotlin: 'kotlin',
  swift: 'swift',
  cs: 'csharp', csharp: 'csharp',
  rb: 'ruby', ruby: 'ruby',
  php: 'php',
};

export const resolveLanguage = (language?: string): string | undefined => {
  if (!language) return undefined;
  return LANG_ALIASES[language.toLowerCase()];
};

// Surface palette from one of the site's own themes.
const codeBlockPalette = (theme: ThemeDefinition) => {
  const v = theme.vars;
  return {
    bg: v['--bg-base'],
    surface: v['--bg-surface'] ?? v['--bg-elevated'],
    border: v['--border'],
    fg: v['--text-primary'],
    muted: v['--text-muted'],
    accent: v['--accent'],
    accentText: v['--accent-text'],
    outputBg: v['--bg-subtle'],
  };
};

// Three pixel "eyes" — the retro/robot face that sits on the snippet toolbar.
const PixelEyes = ({ border }: { border: string }) => (
  <span className="flex items-center gap-1.5" aria-hidden>
    {['#FF3B30', '#FFD23F', '#A6E000'].map((c) => (
      <span
        key={c}
        style={{
          width: 9,
          height: 9,
          transform: 'rotate(45deg)',
          backgroundColor: c,
          border: `2px solid ${border}`,
          display: 'inline-block',
        }}
      />
    ))}
  </span>
);

/**
 * The cream "robot face" plate. The offset shadow is a sibling (not a child)
 * because clip-path would otherwise clip the box-shadow away.
 */
const RobotFacePlate = ({ children, plate }: { children: ReactNode; plate: ReturnType<typeof codeBlockPalette> }) => (
  <div className="my-4" style={{ position: 'relative' }}>
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        transform: 'translate(6px, 6px)',
        backgroundColor: SHADOW_COLOR,
        clipPath: PIXEL_CORNER_CLIP,
      }}
    />
    <div
      style={{
        position: 'relative',
        backgroundColor: plate.surface,
        border: `5px solid ${plate.border}`,
        clipPath: PIXEL_CORNER_CLIP,
        padding: 8,
      }}
    >
      {children}
    </div>
  </div>
);

const StaticCode = ({ language, code, title }: { language?: string; code: string; title?: string }) => {
  const plate = codeBlockPalette(CANONICAL_LIGHT_THEME);
  return (
    <RobotFacePlate plate={plate}>
      <div
        className="overflow-hidden"
        style={{ backgroundColor: '#0a0a0f', border: '4px solid #1a1f14' }}
      >
        <div className="flex items-center gap-3 px-3 py-2" style={{ fontFamily: PIXEL_FONT, fontSize: 10, color: '#e8e8ff' }}>
          <PixelEyes border="#1a1f14" />
          {title ?? language ?? 'code'}
        </div>
        <pre className="px-4 pb-4 text-sm overflow-x-auto font-mono leading-6 whitespace-pre-wrap" style={{ color: '#e8e8ff' }}>
          <code>{code}</code>
        </pre>
      </div>
    </RobotFacePlate>
  );
};

/**
 * Editable, runnable code block with the pixel/robot-terminal look.
 */
export const InteractiveCode = ({
  language,
  code,
  title,
}: {
  language?: string;
  code: string;
  title?: string;
}) => {
  const { t } = useLanguage();
  const [value, setValue] = useState(code);
  const [result, setResult] = useState<CompileResult | null>(null);
  const [running, setRunning] = useState(false);
  const monacoRef = useRef<Monaco | null>(null);

  const langKey = resolveLanguage(language);
  const config = langKey ? LANGUAGES[langKey] : undefined;

  // 1. Cream robot-face plate (site light palette).
  const plate = codeBlockPalette(CANONICAL_LIGHT_THEME);
  // 2. Dark pixelated editor (site dark palette).
  const editorTheme = CANONICAL_DARK_THEME;
  const p = codeBlockPalette(editorTheme);

  useEffect(() => {
    const monaco = monacoRef.current;
    if (!monaco) return;
    monaco.editor.defineTheme(PIXELCODE_CODEBLOCK_THEME, buildCodeBlockTheme(editorTheme));
    monaco.editor.setTheme(PIXELCODE_CODEBLOCK_THEME);
  }, [editorTheme]);

  if (!config) return <StaticCode language={language} code={code} title={title} />;

  const handleRun = async () => {
    if (running) return;
    setRunning(true);
    setResult(null);
    try {
      setResult(await runCode(value, langKey!, ''));
    } catch (e) {
      setResult({
        stdout: '',
        stderr: String(e),
        output: String(e),
        exitCode: 1,
        status: 'error',
        language: config.label,
        version: config.version,
      });
    } finally {
      setRunning(false);
    }
  };

  const handleReset = () => {
    setValue(code);
    setResult(null);
  };

  return (
    <RobotFacePlate plate={plate}>
      {/* Pixelated editor */}
      <div className="overflow-hidden" style={{ backgroundColor: p.bg, border: `4px solid ${p.border}` }}>
        {/* Toolbar — pixel robot face */}
        <div
          className="flex items-center gap-3 px-3 py-2"
          style={{ backgroundColor: p.bg, borderBottom: `3px solid ${p.border}` }}
        >
          <PixelEyes border={p.border} />
          <span className="text-[10px]" style={{ color: p.fg, fontFamily: PIXEL_FONT }}>
            {title ?? config.label}
          </span>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={handleReset}
              title={t('playground.resetCode')}
              style={{
                width: 30,
                height: 30,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: p.bg,
                border: `3px solid ${p.border}`,
                color: p.fg,
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <RotateCcw style={{ width: 13, height: 13 }} />
            </button>
            <button
              onClick={handleRun}
              disabled={running}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontFamily: PIXEL_FONT,
                fontSize: 10,
                textTransform: 'uppercase',
                color: p.accentText,
                backgroundColor: p.accent,
                border: `3px solid ${p.border}`,
                padding: '7px 12px',
                cursor: running ? 'default' : 'pointer',
                opacity: running ? 0.7 : 1,
              }}
            >
              {running ? <Loader2 style={{ width: 11, height: 11 }} className="animate-spin" /> : <Play style={{ width: 11, height: 11 }} />}
              {t('playground.run')}
            </button>
          </div>
        </div>

        {/* Editor */}
        <div dir="ltr" style={{ backgroundColor: p.bg }}>
          <MonacoEditor
            height="200px"
            language={config.monacoLang}
            value={value}
            theme={PIXELCODE_CODEBLOCK_THEME}
            onChange={(v) => setValue(v ?? '')}
            beforeMount={(monaco) => {
              monacoRef.current = monaco;
              monaco.editor.defineTheme(PIXELCODE_CODEBLOCK_THEME, buildCodeBlockTheme(editorTheme));
            }}
            options={{
              fontSize: 13,
              fontFamily: MONACO_FONT_FAMILY,
              fontLigatures: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              lineNumbers: 'on',
              roundedSelection: true,
              automaticLayout: true,
              tabSize: 2,
              wordWrap: 'on',
              padding: { top: 12, bottom: 12 },
              scrollbar: { verticalScrollbarSize: 6, horizontalScrollbarSize: 6 },
            }}
          />
        </div>

        {/* Output */}
        {result && (
          <div
            className="p-3 font-mono text-xs"
            style={{ borderTop: `3px solid ${p.border}`, backgroundColor: p.outputBg, color: p.fg }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] uppercase" style={{ color: p.muted, fontFamily: PIXEL_FONT }}>
                {t('playground.output')}
              </span>
              <span
                className="px-1.5 py-0.5 text-[10px] font-bold"
                style={{
                  backgroundColor: result.status === 'success' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                  color: result.status === 'success' ? '#16a34a' : '#dc2626',
                }}
              >
                {result.status} · exit {result.exitCode}
                {result.time ? ` · ${result.time}ms` : ''}
              </span>
            </div>
            {result.stdout && (
              <pre
                className="whitespace-pre-wrap leading-6 p-3 rounded-md mb-2"
                style={{ backgroundColor: p.bg, border: `2px solid ${p.border}`, color: p.fg }}
              >
                {result.stdout}
              </pre>
            )}
            {result.stderr && (
              <pre
                className="whitespace-pre-wrap leading-6 p-3 rounded-md"
                style={{
                  backgroundColor: 'rgba(239,68,68,0.08)',
                  border: '2px solid rgba(239,68,68,0.3)',
                  color: '#dc2626',
                }}
              >
                {result.stderr}
              </pre>
            )}
            {!result.stdout && !result.stderr && (
              <p style={{ color: p.muted }}>{t('playground.emptyOutput')}</p>
            )}
          </div>
        )}
      </div>
    </RobotFacePlate>
  );
};
