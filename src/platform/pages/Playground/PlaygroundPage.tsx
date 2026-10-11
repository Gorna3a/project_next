'use client';

import { useState, useCallback, useRef, useEffect } from "react";
import Editor, { type Monaco } from "@monaco-editor/react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Play,
  RotateCcw,
  Copy,
  Check,
  Loader2,
  ChevronDown,
  Bot,
  Terminal,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import {
  runCode,
  LANGUAGES,
  type CompileResult,
} from "../../../core/services/compiler";
import { reviewCode, explainError } from "../../../core/services/ai";
import { useTheme } from "../../../core/context/ThemeContext";
import { useLanguage } from "../../../core/context/LanguageContext";
import {
  PIXELCODE_MONACO_THEME,
  MONACO_FONT_FAMILY,
  buildPixelcodeTheme,
} from "../../../shared/ui/monacoTheme";

// ─── Animation variants ───────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" as const },
  },
};

// ─── Language Selector — hard brutalist ───────────────────────────────────────

const LanguageSelector = ({
  selected,
  onChange,
}: {
  selected: string;
  onChange: (lang: string) => void;
}) => {
  const { isRTL } = useLanguage();
  const [open, setOpen] = useState(false);
  const current = LANGUAGES[selected];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2 bg-white text-black border-[3px] border-black shadow-[3px_3px_0_0_#000] px-3 py-1.5 font-mono text-xs font-black uppercase tracking-widest hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0_0_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all ${isRTL ? 'flex-row-reverse' : ''}`}
      >
        <span>{current?.label ?? selected}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className={`absolute ${isRTL ? 'right-0' : 'left-0'} top-full mt-2 z-50 bg-white border-[3px] border-black shadow-[5px_5px_0_0_#000] overflow-hidden`}
            style={{
              width: "200px",
              maxHeight: "320px",
              overflowY: "auto",
            }}
          >
            {Object.entries(LANGUAGES).map(([key, lang]) => (
              <button
                key={key}
                onClick={() => {
                  onChange(key);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 font-mono text-xs font-black uppercase tracking-widest border-b border-black/10 last:border-0 transition-colors ${isRTL ? 'flex-row-reverse text-right' : 'text-left'} ${selected === key ? 'bg-black text-white' : 'bg-white text-black hover:bg-[#FFD23F]'}`}
              >
                {lang.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Output Panel — hard brutalist ────────────────────────────────────────────

type OutputTab = "output" | "ai";

const OutputPanel = ({
  result,
  aiContent,
  activeTab,
  onTabChange,
  isRunning,
  isReviewing,
}: {
  result: CompileResult | null;
  aiContent: string;
  activeTab: OutputTab;
  onTabChange: (tab: OutputTab) => void;
  isRunning: boolean;
  isReviewing: boolean;
}) => {
  const { t, isRTL } = useLanguage();
  const getStatusColor = () => {
    if (!result) return "text-black";
    if (result.status === "success") return "text-black bg-[#88D498] border-black";
    if (result.status === "timeout") return "text-black bg-[#FFD23F] border-black";
    return "text-white bg-[#FF6B6B] border-black";
  };

  const getStatusIcon = () => {
    if (!result) return null;
    if (result.status === "success")
      return <CheckCircle2 className="w-3.5 h-3.5 text-black" />;
    if (result.status === "timeout")
      return <Clock className="w-3.5 h-3.5 text-black" />;
    return <AlertCircle className="w-3.5 h-3.5 text-white" />;
  };

  return (
    <div className="flex flex-col h-full bg-white border-[3px] border-black shadow-[5px_5px_0_0_#000] overflow-hidden">
      {/* Tabs — hard */}
      <div className={`flex items-center gap-2 border-b-[3px] border-black p-2 bg-[#FFFDF5] shrink-0 ${isRTL ? 'flex-row-reverse' : ''}`}>
        {(["output", "ai"] as OutputTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-mono text-[11px] font-black uppercase tracking-widest border-[3px] transition-all ${isRTL ? 'flex-row-reverse' : ''} ${activeTab === tab ? 'bg-black text-white border-black shadow-[2px_2px_0_0_#000]' : 'bg-white text-black border-black hover:bg-[#FFD23F]'}`}
          >
            {tab === "output" ? (
              <>
                <Terminal className="w-3 h-3" /> {t('playground.output')}
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3" /> {t('playground.aiReview')}
              </>
            )}
          </button>
        ))}

        {/* Status indicator */}
        {result && activeTab === "output" && (
          <div className={`${isRTL ? 'mr-auto' : 'ml-auto'} flex items-center gap-1.5 px-2 py-1 font-mono text-[11px] font-black uppercase tracking-widest border-[2px] ${getStatusColor()} ${isRTL ? 'flex-row-reverse' : ''}`}>
            {getStatusIcon()}
            <span>{result.status}</span>
            {result.time && <span>· {result.time}ms</span>}
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 overflow-auto p-4 bg-white ${isRTL ? 'text-right' : 'text-left'}`}>
        {activeTab === "output" ? (
          <div className="h-full">
            {isRunning ? (
              <div className={`flex items-center gap-3 font-mono text-xs font-black uppercase tracking-widest text-black ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Loader2 className="w-4 h-4 animate-spin" />
                {isRTL ? 'جاري تشغيل الكود الخاص بك...' : 'Running your code…'}
              </div>
            ) : result ? (
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="show"
                className="space-y-3"
              >
                {result.stdout && (
                  <div>
                    <p className="font-mono text-[10px] font-black uppercase tracking-widest mb-1.5 text-black">
                      STDOUT
                    </p>
                    <pre className="font-mono text-sm whitespace-pre-wrap leading-6 p-3 bg-[#FFFDF5] border-[3px] border-black text-black text-left dir-ltr">
                      {result.stdout}
                    </pre>
                  </div>
                )}
                {result.stderr && (
                  <div>
                    <p className="font-mono text-[10px] font-black uppercase tracking-widest mb-1.5 text-black">
                      STDERR
                    </p>
                    <pre className="font-mono text-sm whitespace-pre-wrap leading-6 p-3 bg-[#FF6B6B] border-[3px] border-black text-black text-left dir-ltr">
                      {result.stderr}
                    </pre>
                  </div>
                )}
                {!result.stdout && !result.stderr && (
                  <p className="font-mono text-xs font-bold uppercase tracking-widest text-black/60">
                    {isRTL ? 'لم يتم إنتاج أي مخرجات.' : 'No output produced.'}
                  </p>
                )}
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center gap-3 text-center">
                <span className="w-12 h-12 bg-[#FFD23F] border-[3px] border-black grid place-items-center shadow-[3px_3px_0_0_#000] rotate-[-1deg]">
                  <Terminal className="w-6 h-6 text-black" />
                </span>
                <p className="font-mono text-xs font-black uppercase tracking-widest text-black/60 max-w-[220px]">
                  {isRTL ? (
                    <>انقر فوق <span className="bg-black text-white px-1">تشغيل</span> لتنفيذ الكود الخاص بك</>
                  ) : (
                    <>Click <span className="bg-black text-white px-1">Run</span> to execute your code</>
                  )}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full">
            {isReviewing ? (
              <div className={`flex items-center gap-3 font-mono text-xs font-black uppercase tracking-widest text-black ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Loader2 className="w-4 h-4 animate-spin" />
                {isRTL ? 'يقوم الذكاء الاصطناعي بمراجعة الكود الخاص بك...' : 'AI is reviewing your code…'}
              </div>
            ) : aiContent ? (
              <motion.div variants={fadeUp} initial="hidden" animate="show">
                <pre className={`font-mono text-sm whitespace-pre-wrap leading-7 bg-[#FFFDF5] border-[3px] border-black p-3 text-black ${isRTL ? 'text-right' : 'text-left'}`}>
                  {aiContent}
                </pre>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center gap-3 text-center">
                <span className="w-12 h-12 bg-[#74B9FF] border-[3px] border-black grid place-items-center shadow-[3px_3px_0_0_#000] rotate-[1deg]">
                  <Sparkles className="w-6 h-6 text-black" />
                </span>
                <p className="font-mono text-xs font-black uppercase tracking-widest text-black/60 max-w-[220px]">
                  {isRTL ? (
                    <>انقر فوق <span className="bg-black text-white px-1">مراجعة الذكاء الاصطناعي</span> للحصول على تعليقات</>
                  ) : (
                    <>Click <span className="bg-black text-white px-1">AI Review</span> to get feedback on your code</>
                  )}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main Playground Page ─────────────────────────────────────────────────────

export default function PlaygroundPage() {
  const { themeData } = useTheme();
  const { t, isRTL } = useLanguage();

  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(LANGUAGES["python"].starter);
  const [stdin, setStdin] = useState("");
  const [result, setResult] = useState<CompileResult | null>(null);
  const [aiContent, setAiContent] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [activeTab, setActiveTab] = useState<OutputTab>("output");
  const [copied, setCopied] = useState(false);

  const editorRef = useRef<unknown>(null);

  // ── Language change ──────────────────────────────────────────────────────────

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    setCode(LANGUAGES[lang].starter);
    setResult(null);
    setAiContent("");
  };

  // ── Run code ─────────────────────────────────────────────────────────────────

  const handleRun = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    setActiveTab("output");
    setResult(null);
    try {
      const res = await runCode(code, language, stdin);
      setResult(res);
    } catch (e) {
      setResult({
        stdout: "",
        stderr: String(e),
        output: String(e),
        exitCode: 1,
        status: "error",
        language: LANGUAGES[language].label,
        version: LANGUAGES[language].version,
      });
    } finally {
      setIsRunning(false);
    }
  }, [code, language, stdin, isRunning]);

  // ── AI Review ────────────────────────────────────────────────────────────────

  const handleAIReview = useCallback(async () => {
    if (isReviewing || !code.trim()) return;
    setIsReviewing(true);
    setActiveTab("ai");
    setAiContent("");
    try {
      const review = await reviewCode(code, LANGUAGES[language].label);
      setAiContent(review);
    } catch {
      setAiContent(
        isRTL ? "فشل في الحصول على مراجعة الذكاء الاصطناعي. تأكد من تكوين مفتاح Gemini API الخاص بك." : "Failed to get AI review. Make sure your Gemini API key is configured.",
      );
    } finally {
      setIsReviewing(false);
    }
  }, [code, language, isReviewing, isRTL]);

  // ── Explain Error ────────────────────────────────────────────────────────────

  const handleExplainError = useCallback(async () => {
    if (!result?.stderr || isReviewing) return;
    setIsReviewing(true);
    setActiveTab("ai");
    setAiContent("");
    try {
      const explanation = await explainError(
        result.stderr,
        code,
        LANGUAGES[language].label,
      );
      setAiContent(explanation);
    } catch {
      setAiContent(isRTL ? "فشل شرح الخطأ." : "Failed to explain error.");
    } finally {
      setIsReviewing(false);
    }
  }, [result, code, language, isReviewing, isRTL]);

  // ── Reset ────────────────────────────────────────────────────────────────────

  const handleReset = () => {
    setCode(LANGUAGES[language].starter);
    setResult(null);
    setAiContent("");
    setStdin("");
  };

  // ── Copy code ────────────────────────────────────────────────────────────────

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Monaco theme: rebuilt from the active global theme's CSS vars, so the
  // editor surface (background, gutter, cursor, selection, widgets) always
  // matches light/dark/custom themes. Token colors stay stock for readability.
  // NOTE: intentionally NOT using useMonaco() here — that hook attaches a
  // rejection-unhandled branch to the loader promise, so a blocked Monaco CDN
  // surfaces as an "[object Object]" unhandled rejection. beforeMount only
  // runs after a successful load, and the Editor itself logs load failures.
  const monacoRef = useRef<Monaco | null>(null);
  useEffect(() => {
    const monaco = monacoRef.current;
    if (!monaco) return;
    monaco.editor.defineTheme(PIXELCODE_MONACO_THEME, buildPixelcodeTheme(themeData));
    monaco.editor.setTheme(PIXELCODE_MONACO_THEME);
  }, [themeData]);

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="h-[calc(100vh-4rem-3rem)] flex flex-col gap-4 max-w-full pb-4">
      {/* ── Masthead — playground header ── */}
      <div className={`bg-black text-white border-[3px] border-black shadow-[5px_5px_0_0_#000] p-4 flex flex-wrap items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <h1 className="font-black text-lg tracking-tight flex items-center gap-3" style={{ fontFamily: "'Syne', sans-serif" }}>
          <span className="w-2 h-6 bg-[#FFD23F] border border-white hidden sm:inline-block" />
          <Terminal className="w-5 h-5 text-[#FFD23F]" />
          <span className="hidden sm:inline">{t('playground.title') ?? 'Playground'}</span>
        </h1>
        <span className="hidden md:inline-flex font-mono text-[10px] font-black uppercase tracking-widest bg-white text-black border-[2px] border-white px-2 py-1">
          {LANGUAGES[language]?.label} v{LANGUAGES[language]?.version}
        </span>
        <div className={`flex items-center gap-2 flex-wrap ${isRTL ? 'mr-auto flex-row-reverse' : 'ml-auto'}`}>
          <LanguageSelector selected={language} onChange={handleLanguageChange} />
        </div>
      </div>

      {/* ── Toolbar — hard controls ── */}
      <div className={`flex items-center gap-2 flex-wrap shrink-0 bg-white border-[3px] border-black shadow-[4px_4px_0_0_#000] p-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <button
            onClick={handleReset}
            className="bg-white text-black border-[3px] border-black shadow-[2px_2px_0_0_#000] p-2 hover:bg-black hover:text-white active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
            title={t('playground.resetCode')}
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleCopy}
            className="bg-white text-black border-[3px] border-black shadow-[2px_2px_0_0_#000] p-2 hover:bg-black hover:text-white active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
            title={t('playground.copyCode')}
          >
            {copied ? (
              <Check className="w-4 h-4 text-[#88D498]" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>

        <div className={`flex items-center gap-2 flex-wrap ${isRTL ? 'mr-auto flex-row-reverse' : 'ml-auto'}`}>
          {/* AI Review */}
          <button
            onClick={handleAIReview}
            disabled={isReviewing || !code.trim()}
            className={`bg-white text-black border-[3px] border-black shadow-[3px_3px_0_0_#000] font-mono text-xs font-black uppercase tracking-widest px-3 py-1.5 hover:bg-black hover:text-white active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            {isReviewing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Bot className="w-3.5 h-3.5" />
            )}
            {t('playground.aiReview')}
          </button>

          {/* Explain Error — only when error */}
          {result?.status === "error" && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleExplainError}
              disabled={isReviewing}
              className={`bg-[#FF6B6B] text-black border-[3px] border-black shadow-[3px_3px_0_0_#000] font-mono text-xs font-black uppercase tracking-widest px-3 py-1.5 hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0_0_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              {isRTL ? 'شرح الخطأ' : 'Explain Error'}
            </motion.button>
          )}

          {/* Run — primary yellow */}
          <button
            onClick={handleRun}
            disabled={isRunning}
            className={`bg-[#FFD23F] text-black border-[3px] border-black shadow-[3px_3px_0_0_#000] font-mono text-sm font-black uppercase tracking-widest px-5 py-1.5 hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0_0_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            {isRunning ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Play className={`w-4 h-4 fill-current ${isRTL ? 'rotate-180' : ''}`} />
            )}
            {isRunning ? (isRTL ? "جاري التشغيل..." : "Running…") : t('playground.run')}
          </button>
        </div>
      </div>

      {/* ── Main split panel ── */}
      <div className={`flex gap-4 flex-1 min-h-0 ${isRTL ? 'flex-row-reverse' : ''}`}>
        {/* Editor — hard frame */}
        <div className="flex-[6] min-w-0 bg-white border-[3px] border-black shadow-[5px_5px_0_0_#000] overflow-hidden flex flex-col">
          <div className="bg-black text-white border-b-[3px] border-black px-3 py-1.5 flex items-center gap-2 shrink-0">
            <span className="w-2 h-2 bg-[#FFD23F] border border-white" />
            <span className="font-mono text-[10px] font-black uppercase tracking-widest">EDITOR // {LANGUAGES[language]?.label}</span>
            <span className={`font-mono text-[10px] font-bold tracking-widest text-white/60 ${isRTL ? 'mr-auto' : 'ml-auto'}`}>MONACO</span>
          </div>
          <div className="flex-1 min-h-0">
            <Editor
              height="100%"
              language={LANGUAGES[language]?.monacoLang ?? language}
              value={code}
              theme={PIXELCODE_MONACO_THEME}
              onChange={(val) => setCode(val ?? "")}
              beforeMount={(monaco) => {
                monacoRef.current = monaco;
                monaco.editor.defineTheme(PIXELCODE_MONACO_THEME, buildPixelcodeTheme(themeData));
              }}
              onMount={(editor) => {
                editorRef.current = editor;
              }}
              options={{
                fontSize: 14,
                fontFamily: MONACO_FONT_FAMILY,
                fontLigatures: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: "on",
                roundedSelection: true,
                automaticLayout: true,
                tabSize: 4,
                wordWrap: "on",
                padding: { top: 16, bottom: 16 },
                scrollbar: {
                  verticalScrollbarSize: 6,
                  horizontalScrollbarSize: 6,
                },
              }}
            />
          </div>
        </div>

        {/* Output — hard frame */}
        <div className="flex-[4] min-w-0 min-h-0">
          <OutputPanel
            result={result}
            aiContent={aiContent}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            isRunning={isRunning}
            isReviewing={isReviewing}
          />
        </div>
      </div>

      {/* ── Status bar — hard ── */}
      <div className={`flex items-center gap-3 font-mono text-[11px] font-black uppercase tracking-widest bg-white border-[3px] border-black shadow-[3px_3px_0_0_#000] px-3 py-2 shrink-0 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <span className="bg-black text-white border-[2px] border-black px-2 py-0.5">{LANGUAGES[language]?.label}</span>
        <span className="text-black/60">v{LANGUAGES[language]?.version}</span>
        {result && (
          <>
            <span className="text-black">·</span>
            <span className={`px-2 py-0.5 border-[2px] border-black ${result.status === "success" ? "bg-[#88D498] text-black" : "bg-[#FF6B6B] text-black"}`}>
              {isRTL ? 'خروج' : 'exit'} {result.exitCode}
            </span>
            {result.time && <span className="text-black/60">· {result.time}ms</span>}
          </>
        )}
        <span className={`${isRTL ? 'mr-auto' : 'ml-auto'} text-black/60 hidden sm:inline`}>{isRTL ? 'بدعم من Piston API' : 'Powered by Piston API'}</span>
      </div>
    </div>
  );
}
