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
): Promise<string> => {
  const body: Record<string, unknown> = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
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

// ─── Challenge hint ───────────────────────────────────────────────────────────

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
