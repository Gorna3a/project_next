'use client';

import { useState, useCallback, useRef } from "react";
import Editor from "@monaco-editor/react";
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

// ─── Animation variants ───────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" as const },
  },
};

// ─── Language Selector ────────────────────────────────────────────────────────

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
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${isRTL ? 'flex-row-reverse' : ''}`}
        style={{
          backgroundColor: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          color: "var(--text-primary)",
        }}
      >
        <span>{current?.label ?? selected}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          style={{ color: "var(--text-muted)" }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className={`absolute ${isRTL ? 'right-0' : 'left-0'} top-full mt-1 z-50 rounded-xl shadow-xl border overflow-hidden`}
            style={{
              backgroundColor: "var(--bg-elevated)",
              borderColor: "var(--border)",
              width: "180px",
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
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}
                style={{
                  backgroundColor:
                    selected === key ? "var(--accent-subtle)" : "transparent",
                  color:
                    selected === key
                      ? "var(--accent-text)"
                      : "var(--text-secondary)",
                }}
                onMouseEnter={(e) => {
                  if (selected !== key)
                    e.currentTarget.style.backgroundColor = "var(--bg-subtle)";
                }}
                onMouseLeave={(e) => {
                  if (selected !== key)
                    e.currentTarget.style.backgroundColor = "transparent";
                }}
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

// ─── Output Panel ─────────────────────────────────────────────────────────────

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
    if (!result) return "var(--text-muted)";
    if (result.status === "success") return "#22c55e";
    if (result.status === "timeout") return "#f59e0b";
    return "#ef4444";
  };

  const getStatusIcon = () => {
    if (!result) return null;
    if (result.status === "success")
      return (
        <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "#22c55e" }} />
      );
    if (result.status === "timeout")
      return <Clock className="w-3.5 h-3.5" style={{ color: "#f59e0b" }} />;
    return <AlertCircle className="w-3.5 h-3.5" style={{ color: "#ef4444" }} />;
  };

  return (
    <div
      className="flex flex-col h-full rounded-xl overflow-hidden border"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--bg-surface)",
      }}
    >
      {/* Tabs */}
      <div
        className={`flex items-center border-b px-2 pt-2 gap-1 flex-shrink-0 ${isRTL ? 'flex-row-reverse' : ''}`}
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--bg-elevated)",
        }}
      >
        {(["output", "ai"] as OutputTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg text-xs font-medium transition-all duration-200 ${isRTL ? 'flex-row-reverse' : ''}`}
            style={{
              backgroundColor:
                activeTab === tab ? "var(--bg-surface)" : "transparent",
              color:
                activeTab === tab ? "var(--text-primary)" : "var(--text-muted)",
              borderBottom:
                activeTab === tab
                  ? "2px solid var(--accent)"
                  : "2px solid transparent",
            }}
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
          <div
            className={`${isRTL ? 'mr-auto' : 'ml-auto'} flex items-center gap-1.5 px-2 pb-1 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}
            style={{ color: "var(--text-muted)" }}
          >
            {getStatusIcon()}
            <span style={{ color: getStatusColor() }}>{result.status}</span>
            {result.time && <span>· {result.time}ms</span>}
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 overflow-auto p-4 ${isRTL ? 'text-right' : 'text-left'}`}>
        {activeTab === "output" ? (
          <div className="h-full">
            {isRunning ? (
              <div
                className={`flex items-center gap-3 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}
                style={{ color: "var(--text-muted)" }}
              >
                <Loader2
                  className="w-4 h-4 animate-spin"
                  style={{ color: "var(--accent)" }}
                />
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
                    <p
                      className="text-xs font-medium mb-1.5"
                      style={{ color: "var(--text-muted)" }}
                    >
                      STDOUT
                    </p>
                    <pre
                      className="text-sm font-mono whitespace-pre-wrap leading-6 p-3 rounded-lg text-left dir-ltr"
                      style={{
                        backgroundColor: "var(--bg-elevated)",
                        color: "#22c55e",
                      }}
                    >
                      {result.stdout}
                    </pre>
                  </div>
                )}
                {result.stderr && (
                  <div>
                    <p
                      className="text-xs font-medium mb-1.5"
                      style={{ color: "#ef4444" }}
                    >
                      STDERR
                    </p>
                    <pre
                      className="text-sm font-mono whitespace-pre-wrap leading-6 p-3 rounded-lg text-left dir-ltr"
                      style={{
                        backgroundColor: "rgba(239,68,68,0.08)",
                        color: "#ef4444",
                        border: "1px solid rgba(239,68,68,0.2)",
                      }}
                    >
                      {result.stderr}
                    </pre>
                  </div>
                )}
                {!result.stdout && !result.stderr && (
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    {isRTL ? 'لم يتم إنتاج أي مخرجات.' : 'No output produced.'}
                  </p>
                )}
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center gap-3 text-center">
                <Terminal
                  className="w-8 h-8 opacity-20"
                  style={{ color: "var(--text-muted)" }}
                />
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  {isRTL ? (
                    <>انقر فوق <strong>تشغيل</strong> لتنفيذ الكود الخاص بك</>
                  ) : (
                    <>Click <strong>Run</strong> to execute your code</>
                  )}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full">
            {isReviewing ? (
              <div
                className={`flex items-center gap-3 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}
                style={{ color: "var(--text-muted)" }}
              >
                <Loader2
                  className="w-4 h-4 animate-spin"
                  style={{ color: "var(--accent)" }}
                />
                {isRTL ? 'يقوم الذكاء الاصطناعي بمراجعة الكود الخاص بك...' : 'AI is reviewing your code…'}
              </div>
            ) : aiContent ? (
              <motion.div variants={fadeUp} initial="hidden" animate="show">
                <pre
                  className={`text-sm whitespace-pre-wrap leading-7 font-sans ${isRTL ? 'text-right' : 'text-left'}`}
                  style={{ color: "var(--text-secondary)" }}
                >
                  {aiContent}
                </pre>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center gap-3 text-center">
                <Sparkles
                  className="w-8 h-8 opacity-20"
                  style={{ color: "var(--text-muted)" }}
                />
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  {isRTL ? (
                    <>انقر فوق <strong>مراجعة الذكاء الاصطناعي</strong> للحصول على تعليقات</>
                  ) : (
                    <>Click <strong>AI Review</strong> to get feedback on your code</>
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

  // Monaco theme: use vs-dark for all dark themes, vs for light
  const monacoTheme = themeData.isDark ? "vs-dark" : "vs";

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="h-[calc(100vh-4rem-3rem)] flex flex-col gap-3 max-w-full">
      {/* ── Top bar ── */}
      <div className={`flex items-center gap-2 flex-wrap flex-shrink-0 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <LanguageSelector selected={language} onChange={handleLanguageChange} />

        <div className={`flex items-center gap-1.5 ${isRTL ? 'mr-auto' : 'ml-auto'} flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Reset */}
          <button
            onClick={handleReset}
            className="btn-ghost p-2"
            title={t('playground.resetCode')}
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Copy */}
          <button
            onClick={handleCopy}
            className="btn-ghost p-2"
            title={t('playground.copyCode')}
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>

          {/* AI Review */}
          <button
            onClick={handleAIReview}
            disabled={isReviewing || !code.trim()}
            className={`btn-secondary flex items-center gap-2 text-xs px-3 py-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            {isReviewing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Bot className="w-3.5 h-3.5" />
            )}
            {t('playground.aiReview')}
          </button>

          {/* Explain Error — only shown when there's an error */}
          {result?.status === "error" && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleExplainError}
              disabled={isReviewing}
              className={`btn-secondary flex items-center gap-2 text-xs px-3 py-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}
              style={{ borderColor: "#ef4444", color: "#ef4444" }}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              {isRTL ? 'شرح الخطأ' : 'Explain Error'}
            </motion.button>
          )}

          {/* Run */}
          <button
            onClick={handleRun}
            disabled={isRunning}
            className={`btn-primary flex items-center gap-2 text-sm px-4 py-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}
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
      <div className={`flex gap-3 flex-1 min-h-0 ${isRTL ? 'flex-row-reverse' : ''}`}>
        {/* Editor */}
        <div
          className="flex-[6] min-w-0 rounded-xl overflow-hidden border"
          style={{ borderColor: "var(--border)" }}
        >
          <Editor
            height="100%"
            language={LANGUAGES[language]?.monacoLang ?? language}
            value={code}
            theme={monacoTheme}
            onChange={(val) => setCode(val ?? "")}
            onMount={(editor) => {
              editorRef.current = editor;
            }}
            options={{
              fontSize: 14,
              fontFamily: "JetBrains Mono, Fira Code, monospace",
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

        {/* Output */}
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

      {/* ── Status bar ── */}
      <div
        className={`flex items-center gap-4 text-xs flex-shrink-0 px-1 ${isRTL ? 'flex-row-reverse' : ''}`}
        style={{ color: "var(--text-muted)" }}
      >
        <span>{LANGUAGES[language]?.label}</span>
        <span>v{LANGUAGES[language]?.version}</span>
        {result && (
          <>
            <span>·</span>
            <span
              style={{
                color: result.status === "success" ? "#22c55e" : "#ef4444",
              }}
            >
              {isRTL ? 'خروج' : 'exit'} {result.exitCode}
            </span>
            {result.time && <span>· {result.time}ms</span>}
          </>
        )}
        <span className={isRTL ? 'mr-auto' : 'ml-auto'}>{isRTL ? 'بدعم من Piston API' : 'Powered by Piston API'}</span>
      </div>
    </div>
  );
}
