// ─── Gemini AI Service ────────────────────────────────────────────────────────
// Uses Google Gemini REST API v1 directly (not the SDK) for full control
// over API version and model selection.
// Free tier: 1500 requests/day, 1M tokens/min — https://aistudio.google.com
//
// API key: VITE_GEMINI_API_KEY in .env
// Get one free at: https://aistudio.google.com → Get API Key

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY as string;
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
// gemini-1.5-flash has its own free-tier quota separate from gemini-2.0-flash
const MODEL = "gemini-2.5-flash";

if (!API_KEY) {
  console.warn(
    "[PixelCode AI] VITE_GEMINI_API_KEY is not set. AI features will not work.",
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface GeminiContent {
  role: "user" | "model";
  parts: { text: string }[];
}

// ─── Chat completion (streaming) ──────────────────────────────────────────────

export interface StreamChatOptions {
  messages: { role: "user" | "assistant"; content: string }[];
  onChunk: (chunk: string) => void;
  signal?: AbortSignal;
  systemPrompt?: string;
}

export const streamChat = async ({
  messages,
  onChunk,
  signal,
  systemPrompt = `You are PixelCode AI, a helpful programming tutor.
Be concise, friendly, and focus on code quality.
Use code blocks when showing code examples.
Never refuse to help with legitimate programming questions.`,
}: StreamChatOptions): Promise<void> => {
  const contents: GeminiContent[] = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : ("user" as "user" | "model"),
    parts: [{ text: m.content }],
  }));

  const body = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 4096,
    },
  };

  const res = await fetch(
    `${BASE_URL}/models/${MODEL}:streamGenerateContent?alt=sse&key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal,
    },
  );

  if (!res.ok) {
    const errText = await res.text();
    console.error("[PixelCode AI] streamChat HTTP error:", res.status, errText);
    if (res.status === 429) {
      // Parse retry delay from response if available
      let retryMsg = "AI quota reached. Please wait a moment and try again.";
      try {
        const errJson = JSON.parse(errText);
        const retryDelay = errJson?.error?.details?.find(
          (d: Record<string, string>) => d["@type"]?.includes("RetryInfo")
        )?.retryDelay;
        if (retryDelay) retryMsg = `AI quota reached. Retry in ${retryDelay}.`;
      } catch { /* ignore */ }
      onChunk(`\n⚠️ ${retryMsg}`);
      return;
    }
    throw new Error(`Gemini API error ${res.status}: ${errText}`);
  }

  // Parse SSE stream
  const reader = res.body?.getReader();
  const decoder = new TextDecoder();
  if (!reader) throw new Error("No response body");

  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done || signal?.aborted) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.startsWith("data:")) continue;
      const data = line.slice(5).trim();
      if (data === "[DONE]") return;
      try {
        const json = JSON.parse(data);
        const text = json?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
        if (text) onChunk(text);
      } catch {
        // ignore malformed chunks
      }
    }
  }
};

// ─── Single completion (no streaming) ────────────────────────────────────────

export const complete = async (
  prompt: string,
  systemPrompt?: string,
  temperature: number = 0.7,
): Promise<string> => {
  const body: Record<string, unknown> = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { temperature, maxOutputTokens: 2048 },
  };

  if (systemPrompt) {
    body.system_instruction = { parts: [{ text: systemPrompt }] };
  }

  const res = await fetch(
    `${BASE_URL}/models/${MODEL}:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );

  if (!res.ok) {
    const errText = await res.text();
    console.error("[PixelCode AI] complete HTTP error:", res.status, errText);
    if (res.status === 429) {
      return "⚠️ AI quota reached. Please wait a moment and try again.";
    }
    throw new Error(`Gemini API error ${res.status}: ${errText}`);
  }

  const json = await res.json();
  return json?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
};

// ─── Challenge solution grading ───────────────────────────────────────────────
// Same model as the chatbot. The AI decides correctness, shows the canonical
// solution, and explains why a wrong attempt fails. Low temperature keeps
// verdicts as deterministic as possible. Never throws on unparseable output
// — callers must treat that as "incorrect, show the raw text".

export interface GradeVerdict {
  correct: boolean;
  /** Markdown: what is wrong and why (empty when correct) */
  feedback: string;
  /** Canonical correct code */
  solution: string;
  /** True when the model reply could not be parsed as a verdict */
  unparsed: boolean;
}

export const gradeSolution = async (args: {
  title: string;
  language: string;
  task: string;
  reference: string;
  attempt: string;
}): Promise<GradeVerdict> => {
  const raw = await complete(
    `Challenge: ${args.title} (${args.language})
Task:
${args.task}

Reference solution (canonical, for your eyes only — quote it back as "solution"):
\`\`\`
${args.reference}
\`\`\`

Student attempt:
\`\`\`
${args.attempt}
\`\`\`

Decide: does the attempt satisfy the task? Be strict but fair — ignore
whitespace/formatting differences, but reject logically wrong code.
CRITICAL: the "feedback" field must NEVER contain the corrected code, a full
solution, or a code block that solves the task. Explain the mistake
conceptually (wrong variable, wrong operator, off-by-one, missing call) and
point at the general area, so the student must still write the fix themselves.
Reply with ONLY this JSON, no fences, no extra text:
{"correct": true|false, "feedback": "<markdown: what is wrong and why, or empty string when correct>", "solution": "<the canonical correct code>"}`,
    `You are a strict programming-exercise grader. You always reply with a single
JSON object and nothing else. You never leak the solution inside "feedback".`,
    0.2,
  );

  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");
  try {
    const parsed = JSON.parse(cleaned) as {
      correct?: unknown;
      feedback?: unknown;
      solution?: unknown;
    };
    return {
      correct: parsed.correct === true,
      feedback: typeof parsed.feedback === "string" ? parsed.feedback : "",
      solution:
        typeof parsed.solution === "string" && parsed.solution.trim()
          ? parsed.solution
          : args.reference,
      unparsed: false,
    };
  } catch {
    return { correct: false, feedback: raw, solution: args.reference, unparsed: true };
  }
};

export const generateHint = async (
  question: string,
  options: string[],
): Promise<string> => {
  return complete(
    `Challenge: ${question}\nOptions: ${options.join(" | ")}`,
    `You are a coding hint generator.
Give a SHORT hint (max 2 sentences) that guides the student WITHOUT revealing the answer.
Focus on the key concept being tested.`,
  );
};

// ─── Code review ──────────────────────────────────────────────────────────────

export const reviewCode = async (
  code: string,
  language: string,
): Promise<string> => {
  return complete(
    `Review this ${language} code:\n\`\`\`${language}\n${code}\n\`\`\``,
    `You are a senior ${language} developer doing a code review.
Point out: bugs, style issues, performance improvements, and security concerns.
Be constructive and educational. Format with clear sections.`,
  );
};

// ─── Error explanation ────────────────────────────────────────────────────────

export const explainError = async (
  error: string,
  code: string,
  language: string,
): Promise<string> => {
  return complete(
    `Language: ${language}\nError: ${error}\nCode:\n\`\`\`${language}\n${code}\n\`\`\``,
    `You are a helpful programming tutor.
Explain this error clearly and show how to fix it.
Be concise and educational.`,
  );
};
