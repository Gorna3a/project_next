'use client';

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Send,
  Plus,
  Trash2,
  Bot,
  Search,
  MessageSquare,
  Loader2,
} from "lucide-react";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../../../core/firebase/config";
import { useAuth } from "../../../core/context/AuthContext";
import { useLanguage } from "../../../core/context/LanguageContext";
import { streamChat } from "../../../core/services/ai";
import { MarkdownMessage } from "./MarkdownMessage";
import type { ChatMessage, ChatSession } from "../../../core/types";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" as const },
  },
};

const SYSTEM_PROMPT = `You are PixelCode AI, an expert programming tutor and coding assistant.
You help students learn programming concepts, debug code, review solutions, and explain errors clearly.
Be friendly, educational, and concise. Use code examples when helpful.
Format code with proper markdown code blocks and specify the language.
Never refuse to help with legitimate programming questions.`;

// ─── Typing indicator ─────────────────────────────────────────────────────────

const TypingDots = () => (
  <div className="flex items-center gap-1 px-1 py-2">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: "var(--text-muted)" }}
        animate={{ y: [0, -4, 0] }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          delay: i * 0.15,
          ease: "easeInOut" as const,
        }}
      />
    ))}
  </div>
);

// ─── Chat message bubble ──────────────────────────────────────────────────────

const MessageBubble = ({ message, isRTL }: { message: ChatMessage, isRTL: boolean }) => {
  const isUser = message.role === "user";
  // Logic: if RTL, user messages are on the left (reverse row), AI on right.
  // Wait, standard RTL chat: User is right, AI is left. 
  // Let's stick to consistent flex logic.
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
      className={`flex gap-3 ${isUser ? (isRTL ? "flex-row" : "flex-row-reverse") : (isRTL ? "flex-row-reverse" : "flex-row")}`}
    >
      {/* Avatar */}
      {!isUser && (
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
          style={{ backgroundColor: "var(--accent-subtle)" }}
        >
          <Bot className="w-4 h-4" style={{ color: "var(--accent-text)" }} />
        </div>
      )}

      {/* Bubble */}
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 ${isUser ? (isRTL ? "rounded-tl-sm" : "rounded-tr-sm") : (isRTL ? "rounded-tr-sm" : "rounded-tl-sm")}`}
        style={{
          backgroundColor: isUser ? "var(--accent)" : "var(--bg-elevated)",
          color: isUser ? "white" : "var(--text-primary)",
          textAlign: isRTL ? 'right' : 'left'
        }}
      >
        {message.isStreaming && !message.content ? (
          <TypingDots />
        ) : (
          <MarkdownMessage content={message.content} isUser={isUser} />
        )}
      </div>
    </motion.div>
  );
};

// ─── Main ChatPage ────────────────────────────────────────────────────────────

export default function ChatPage() {
  const { user } = useAuth();
  const { t, isRTL } = useLanguage();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [search, setSearch] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const currentSession = sessions.find((s) => s.id === currentId) ?? null;
  const messages = currentSession?.messages ?? [];

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase()),
  );

  // ── Load sessions from Firestore ─────────────────────────────────────────────
  useEffect(() => {
    if (!user?.uid) {
      setSessions([]);
      return;
    }
    const q = query(
      collection(db, "users", user.uid, "chats"),
      orderBy("updatedAt", "desc"),
    );
    const unsub = onSnapshot(q, (snap) => {
      setSessions(
        snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            title: data.title ?? t('chat.untitled'),
            messages: data.messages ?? [],
            createdAt: data.createdAt?.toDate?.() ?? new Date(),
            updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
          } as ChatSession;
        }),
      );
    });
    return unsub;
  }, [user?.uid, t]);

  // ── Scroll to bottom on new messages ─────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Save session to Firestore ─────────────────────────────────────────────────
  const saveSession = useCallback(
    async (session: ChatSession) => {
      if (!user?.uid) return;
      await setDoc(doc(db, "users", user.uid, "chats", session.id), {
        title: session.title,
        messages: session.messages.map((m) => ({
          role: m.role,
          content: m.content,
          timestamp: m.timestamp,
        })),
        createdAt: session.createdAt,
        updatedAt: new Date(),
      });
    },
    [user?.uid],
  );

  // ── Send message ─────────────────────────────────────────────────────────────
  const handleSend = useCallback(async () => {
    if (!input.trim() || isStreaming || !user) return;

    const userMsg: ChatMessage = {
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };
    setInput("");

    // Create or get current session
    let session: ChatSession;
    if (!currentId) {
      session = {
        id: Date.now().toString(),
        title:
          input.trim().slice(0, 40) + (input.trim().length > 40 ? "…" : ""),
        messages: [userMsg],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setCurrentId(session.id);
    } else {
      const existing = sessions.find((s) => s.id === currentId);
      if (!existing) return;
      session = {
        ...existing,
        messages: [...existing.messages, userMsg],
        updatedAt: new Date(),
      };
    }

    // Add streaming placeholder
    const streamingMsg: ChatMessage = {
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isStreaming: true,
    };
    const sessionWithStream = {
      ...session,
      messages: [...session.messages, streamingMsg],
    };

    setSessions((prev) => {
      const exists = prev.find((s) => s.id === session.id);
      return exists
        ? prev.map((s) => (s.id === session.id ? sessionWithStream : s))
        : [sessionWithStream, ...prev];
    });

    setIsStreaming(true);
    abortRef.current = new AbortController();
    let fullResponse = "";

    try {
      await streamChat({
        messages: session.messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        systemPrompt: SYSTEM_PROMPT,
        signal: abortRef.current.signal,
        onChunk: (chunk) => {
          fullResponse += chunk;
          setSessions((prev) =>
            prev.map((s) => {
              if (s.id !== session.id) return s;
              const msgs = [...s.messages];
              const last = msgs[msgs.length - 1];
              if (last?.role === "assistant") {
                msgs[msgs.length - 1] = { ...last, content: fullResponse };
              }
              return { ...s, messages: msgs };
            }),
          );
        },
      });

      // Finalise — strip isStreaming flag and persist
      const finalSession: ChatSession = {
        ...sessionWithStream,
        messages: [
          ...session.messages,
          {
            role: "assistant",
            content: fullResponse,
            timestamp: new Date(),
            isStreaming: false,
          },
        ],
        updatedAt: new Date(),
      };
      setSessions((prev) =>
        prev.map((s) => (s.id === session.id ? finalSession : s)),
      );
      await saveSession(finalSession);
    } catch (e: unknown) {
      if (e instanceof Error && e.name !== "AbortError") {
        const detail = e.message ?? String(e);
        const errMsg: ChatMessage = {
          role: "assistant",
          content: `⚠️ AI Error: ${detail}`,
          timestamp: new Date(),
        };
        const errSession = {
          ...session,
          messages: [...session.messages, errMsg],
          updatedAt: new Date(),
        };
        setSessions((prev) =>
          prev.map((s) => (s.id === session.id ? errSession : s)),
        );
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
      inputRef.current?.focus();
    }
  }, [input, isStreaming, user, currentId, sessions, saveSession]);

  // ── Delete session ────────────────────────────────────────────────────────────
  const deleteSession = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user?.uid) return;
    await deleteDoc(doc(db, "users", user.uid, "chats", id));
    if (currentId === id) setCurrentId(null);
  };

  // ── New chat ──────────────────────────────────────────────────────────────────
  const startNewChat = () => {
    if (abortRef.current) abortRef.current.abort();
    setCurrentId(null);
    setInput("");
    inputRef.current?.focus();
  };

  // ── Handle Enter key ─────────────────────────────────────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div
      className={`flex h-[calc(100vh-4rem-3rem)] -mx-6 -my-6 overflow-hidden rounded-2xl border ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}
      style={{ borderColor: "var(--border)" }}
    >
      {/* ── Sidebar ── */}
      <div
        className={`w-64 flex-shrink-0 flex flex-col ${isRTL ? 'border-l' : 'border-r'}`}
        style={{
          backgroundColor: "var(--bg-surface)",
          borderColor: "var(--border)",
        }}
      >
        {/* Header */}
        <div
          className="p-3 border-b flex-shrink-0"
          style={{ borderColor: "var(--border)" }}
        >
          <button
            onClick={startNewChat}
            className={`btn-primary w-full justify-center text-sm py-2 gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <Plus className="w-4 h-4" /> {t('chat.newChat')}
          </button>
          <div className="relative mt-2">
            <Search
              className={`absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${isRTL ? 'right-2.5' : 'left-2.5'}`}
              style={{ color: "var(--text-muted)" }}
            />
            <input
              type="text"
              placeholder={t('chat.searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`input text-xs py-2 ${isRTL ? 'pr-8 text-right' : 'pl-8 text-left'}`}
            />
          </div>
        </div>

        {/* Session list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredSessions.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare
                className="w-8 h-8 mx-auto mb-2 opacity-20"
                style={{ color: "var(--text-muted)" }}
              />
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {search ? t('chat.noChatsMatch') : t('chat.noChatsYet')}
              </p>
            </div>
          ) : (
            filteredSessions.map((session) => (
              <div
                key={session.id}
                role="button"
                tabIndex={0}
                onClick={() => setCurrentId(session.id)}
                onKeyDown={(e) => e.key === "Enter" && setCurrentId(session.id)}
                className={`w-full px-3 py-2.5 rounded-xl transition-all duration-200 group flex items-start justify-between gap-2 cursor-pointer ${isRTL ? 'text-right flex-row-reverse' : 'text-left'}`}
                style={{
                  backgroundColor:
                    currentId === session.id
                      ? "var(--accent-subtle)"
                      : "transparent",
                  color:
                    currentId === session.id
                      ? "var(--accent-text)"
                      : "var(--text-secondary)",
                }}
                onMouseEnter={(e) => {
                  if (currentId !== session.id)
                    (e.currentTarget as HTMLDivElement).style.backgroundColor =
                      "var(--bg-subtle)";
                }}
                onMouseLeave={(e) => {
                  if (currentId !== session.id)
                    (e.currentTarget as HTMLDivElement).style.backgroundColor =
                      "transparent";
                }}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium truncate">
                    {session.title}
                  </p>
                  <p className="text-xs mt-0.5 opacity-60">
                    {session.updatedAt.toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}
                  </p>
                </div>
                <button
                  onClick={(e) => deleteSession(session.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded-lg transition-all hover:text-red-500 flex-shrink-0"
                  style={{ color: "var(--text-muted)" }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Main chat area ── */}
      <div
        className="flex-1 flex flex-col min-w-0"
        style={{ backgroundColor: "var(--bg-base)" }}
      >
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: "var(--accent-subtle)" }}
              >
                <Bot
                  className="w-7 h-7"
                  style={{ color: "var(--accent-text)" }}
                />
              </div>
              <div>
                <h3
                  className="font-semibold text-lg mb-1"
                  style={{ color: "var(--text-primary)" }}
                >
                  {t('chat.aiName')}
                </h3>
                <p
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {t('chat.aiDesc')}
                </p>
              </div>
              <div className={`grid grid-cols-2 gap-2 max-w-md mt-2 ${isRTL ? 'direction-rtl' : ''}`}>
                {(t('chat.suggestions') as unknown as string[]).map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setInput(suggestion);
                      inputRef.current?.focus();
                    }}
                    className={`text-xs p-3 rounded-xl transition-all duration-200 border ${isRTL ? 'text-right' : 'text-left'}`}
                    style={{
                      backgroundColor: "var(--bg-surface)",
                      borderColor: "var(--border)",
                      color: "var(--text-secondary)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "var(--bg-elevated)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "var(--bg-surface)")
                    }
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, i) => <MessageBubble key={i} message={msg} isRTL={isRTL} />)
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input bar */}
        <div
          className="p-4 border-t flex-shrink-0"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--bg-surface)",
          }}
        >
          {!user && (
            <p
              className="text-xs text-center mb-2"
              style={{ color: "var(--text-muted)" }}
            >
              {t('chat.signInToSave')}
            </p>
          )}
          <div className={`flex gap-2 items-end ${isRTL ? 'flex-row-reverse' : ''}`}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('chat.inputPlaceholder')}
              rows={1}
              disabled={isStreaming}
              className={`input flex-1 resize-none text-sm py-3 ${isRTL ? 'text-right' : 'text-left'}`}
              style={{ maxHeight: "120px", overflowY: "auto" }}
            />
            <button
              onClick={handleSend}
              disabled={isStreaming || !input.trim()}
              className="btn-primary p-3 flex-shrink-0 rounded-xl"
              style={{ height: "46px", width: "46px" }}
            >
              {isStreaming ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              )}
            </button>
          </div>
          <p
            className="text-xs mt-1.5 text-center"
            style={{ color: "var(--text-muted)" }}
          >
            {t('chat.poweredBy')}
          </p>
        </div>
      </div>
    </div>
  );
}

// Satisfy the unused-import linter for AnimatePresence (kept for future slide transitions)
void AnimatePresence;
