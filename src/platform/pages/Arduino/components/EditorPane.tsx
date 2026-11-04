'use client';

import dynamic from 'next/dynamic';
import type { Monaco } from "@monaco-editor/react";
import { useEffect, useRef } from 'react';
import type * as MonacoTypes from "monaco-editor";
import {
  PIXELCODE_MONACO_THEME,
  buildPixelcodeTheme,
  MONACO_FONT_FAMILY,
} from "../../../../shared/ui/monacoTheme";
import { useTheme } from "../../../../core/context/ThemeContext";
import type { Diagnostic } from "@core/simulator";
import { cn, CRT_MONO, CRT_MUTED, CRT_SURFACE } from "../utils/ui";

const MonacoEditor = dynamic(
  () => import("@monaco-editor/react").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="h-44 grid place-items-center text-xs" style={{ color: '#8b8ba0', fontFamily: MONACO_FONT_FAMILY }}>
        LOADING EDITOR…
      </div>
    ),
  },
);

interface EditorPaneProps {
  sketch: string;
  onSketchChange: (value: string) => void;
  diagnostics: Diagnostic[];
  onRun: () => void;
  compact?: boolean;
}

const MARKER_OWNER = "arduino-sim";
const MAX_MARKERS = 60;

export const EditorPane = ({
  sketch,
  onSketchChange,
  diagnostics,
  onRun,
  compact = false,
}: EditorPaneProps) => {
  const { themeData } = useTheme();
  const monacoRef = useRef<Monaco | null>(null);
  const editorRef = useRef<MonacoTypes.editor.IStandaloneCodeEditor | null>(null);
  const runRef = useRef(onRun);

  useEffect(() => {
    runRef.current = onRun;
  }, [onRun]);

  const applyMarkers = () => {
    const monaco = monacoRef.current;
    const model = editorRef.current?.getModel();
    if (!monaco || !model) return;
    monaco.editor.setModelMarkers(
      model,
      MARKER_OWNER,
      diagnostics
        .filter((item) => item.line !== undefined && item.line !== null)
        .slice(0, MAX_MARKERS)
        .map((item) => ({
          startLineNumber: item.line ?? 1,
          endLineNumber: item.line ?? 1,
          startColumn: item.column ?? 1,
          endColumn: (item.column ?? 1) + 1,
          message: `[${item.source}] ${item.message}`,
          severity:
            item.severity === "error" ? monaco.MarkerSeverity.Error : monaco.MarkerSeverity.Warning,
        })),
    );
  };

  useEffect(() => {
    applyMarkers();
  });

  useEffect(() => {
    const monaco = monacoRef.current;
    if (!monaco) return;
    monaco.editor.defineTheme(PIXELCODE_MONACO_THEME, buildPixelcodeTheme(themeData));
    monaco.editor.setTheme(PIXELCODE_MONACO_THEME);
  }, [themeData]);

  return (
    <div className={cn("h-full rounded-none", CRT_SURFACE)}>
      <MonacoEditor
        height="100%"
        language="cpp"
        value={sketch}
        theme={PIXELCODE_MONACO_THEME}
        onChange={(value) => onSketchChange(value ?? "")}
        beforeMount={(monaco) => {
          monacoRef.current = monaco;
          monaco.editor.defineTheme(PIXELCODE_MONACO_THEME, buildPixelcodeTheme(themeData));
          monaco.languages.typescript?.javascriptDefaults?.setDiagnosticsOptions({
            noSemanticValidation: true,
            noSyntaxValidation: true,
          });
        }}
        onMount={(editor) => {
          editorRef.current = editor;
          editor.addCommand(
            (monacoRef.current?.KeyMod.CtrlCmd ?? 0) | (monacoRef.current?.KeyCode.KeyS ?? 0),
            () => runRef.current(),
          );
          applyMarkers();
        }}
        loading={
          <div
            className={cn(
              "grid h-full w-full place-items-center text-[10px] uppercase tracking-[0.2em]",
              CRT_MONO,
              CRT_MUTED,
            )}
          >
            {"> BOOTING EDITOR..."}
          </div>
        }
      options={{
        fontSize: compact ? 12 : 13,
        fontFamily: MONACO_FONT_FAMILY,
        fontLigatures: true,
        minimap: {
          enabled: !compact,
          scale: 1,
          renderCharacters: false,
          showSlider: "always",
        },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        wordWrap: "on",
        rulers: compact ? [] : [80, 120],
        renderLineHighlight: "all",
        cursorBlinking: "smooth",
        smoothScrolling: true,
        folding: true,
        bracketPairColorization: { enabled: true },
        padding: { top: compact ? 8 : 10, bottom: 14 },
        lineNumbersMinChars: compact ? 3 : 5,
        scrollbar: { verticalScrollbarSize: 10, horizontalScrollbarSize: 10 },
      }}
      />
    </div>
  );
};
