// ─── Judge0 CE Code Execution Service ────────────────────────────────────────
// Uses Judge0 Community Edition via a local Vite proxy to bypass CORS.
// In production, point VITE_JUDGE0_URL to your own Judge0 instance or proxy.

const JUDGE0_URL = process.env.NEXT_PUBLIC_JUDGE0_URL ?? "https://ce.judge0.com";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CompileResult {
  stdout: string;
  stderr: string;
  output: string; // stdout + stderr combined
  exitCode: number;
  status: "success" | "error" | "timeout";
  language: string;
  version: string;
  time?: number; // ms
}

export interface PistonRuntime {
  language: string;
  version: string;
  aliases: string[];
}

// ─── Language config ──────────────────────────────────────────────────────────

export interface LanguageConfig {
  languageId: number; // Judge0 CE language ID
  version: string; // for display only
  label: string;
  extension: string;
  starter: string;
  monacoLang: string;
}

// Judge0 CE language IDs — https://ce.judge0.com/languages
export const LANGUAGES: Record<string, LanguageConfig> = {
  python: {
    languageId: 71,
    version: "3.8.1",
    label: "Python 3",
    extension: "py",
    monacoLang: "python",
    starter: `# Welcome to PixelCode!
print("Hello, World!")
`,
  },
  javascript: {
    languageId: 63,
    version: "12.14.0",
    label: "JavaScript",
    extension: "js",
    monacoLang: "javascript",
    starter: `// Welcome to PixelCode!
console.log("Hello, World!");
`,
  },
  typescript: {
    languageId: 74,
    version: "3.7.4",
    label: "TypeScript",
    extension: "ts",
    monacoLang: "typescript",
    starter: `// Welcome to PixelCode!
const greet = (name: string): string => \`Hello, \${name}!\`;
console.log(greet("World"));
`,
  },
  java: {
    languageId: 62,
    version: "13.0.1",
    label: "Java",
    extension: "java",
    monacoLang: "java",
    starter: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
`,
  },
  c: {
    languageId: 50,
    version: "9.2.0",
    label: "C",
    extension: "c",
    monacoLang: "c",
    starter: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}
`,
  },
  cpp: {
    languageId: 54,
    version: "9.2.0",
    label: "C++",
    extension: "cpp",
    monacoLang: "cpp",
    starter: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}
`,
  },
  go: {
    languageId: 60,
    version: "1.13.5",
    label: "Go",
    extension: "go",
    monacoLang: "go",
    starter: `package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}
`,
  },
  rust: {
    languageId: 73,
    version: "1.40.0",
    label: "Rust",
    extension: "rs",
    monacoLang: "rust",
    starter: `fn main() {
    println!("Hello, World!");
}
`,
  },
  kotlin: {
    languageId: 78,
    version: "1.3.70",
    label: "Kotlin",
    extension: "kt",
    monacoLang: "kotlin",
    starter: `fun main() {
    println("Hello, World!")
}
`,
  },
  swift: {
    languageId: 83,
    version: "5.2.3",
    label: "Swift",
    extension: "swift",
    monacoLang: "swift",
    starter: `print("Hello, World!")
`,
  },
  csharp: {
    languageId: 51,
    version: "6.6.0",
    label: "C#",
    extension: "cs",
    monacoLang: "csharp",
    starter: `using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello, World!");
    }
}
`,
  },
  ruby: {
    languageId: 72,
    version: "2.7.0",
    label: "Ruby",
    extension: "rb",
    monacoLang: "ruby",
    starter: `puts "Hello, World!"
`,
  },
  php: {
    languageId: 68,
    version: "7.4.1",
    label: "PHP",
    extension: "php",
    monacoLang: "php",
    starter: `<?php
echo "Hello, World!\\n";
`,
  },
};

// ─── Judge0 status IDs ────────────────────────────────────────────────────────

const isSuccess = (statusId: number) => statusId === 3;
const isTimeout = (statusId: number) => statusId === 5;
// 6 = Compilation Error, 7-14 = Runtime Errors, 3 = Accepted

// ─── Run code ─────────────────────────────────────────────────────────────────

export const runCode = async (
  code: string,
  languageKey: string,
  stdin: string = "",
): Promise<CompileResult> => {
  const config = LANGUAGES[languageKey];
  if (!config) throw new Error(`Unsupported language: ${languageKey}`);

  const startTime = Date.now();

  // Submit with wait=true — no polling needed, result comes back immediately
  const response = await fetch(
    `${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source_code: code,
        language_id: config.languageId,
        stdin: stdin || null,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(
      `Judge0 API error: ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json();
  const elapsed = Date.now() - startTime;

  const statusId = data.status?.id ?? 0;
  const statusDesc = data.status?.description ?? "Unknown";
  const stdout = data.stdout ?? "";
  const stderr = data.stderr ?? "";
  const compileOutput = data.compile_output ?? "";

  // Compilation error
  if (statusId === 6) {
    return {
      stdout: "",
      stderr: compileOutput || "Compilation failed",
      output: compileOutput || "Compilation failed",
      exitCode: 1,
      status: "error",
      language: config.label,
      version: config.version,
      time: elapsed,
    };
  }

  // Timeout
  if (isTimeout(statusId)) {
    return {
      stdout,
      stderr: "Execution timed out",
      output: "Execution timed out",
      exitCode: 1,
      status: "timeout",
      language: config.label,
      version: config.version,
      time: elapsed,
    };
  }

  // Runtime error or other failure
  if (!isSuccess(statusId)) {
    const errorMsg = stderr || compileOutput || `Runtime error: ${statusDesc}`;
    return {
      stdout,
      stderr: errorMsg,
      output: stdout + (errorMsg ? `\n${errorMsg}` : ""),
      exitCode: 1,
      status: "error",
      language: config.label,
      version: config.version,
      time: elapsed,
    };
  }

  // Success
  return {
    stdout,
    stderr,
    output: stdout + (stderr ? `\n${stderr}` : ""),
    exitCode: 0,
    status: "success",
    language: config.label,
    version: config.version,
    time: elapsed,
  };
};

// ─── Keep this for compatibility ──────────────────────────────────────────────
export const getRuntimes = async (): Promise<PistonRuntime[]> => {
  const res = await fetch(`${JUDGE0_URL}/languages`);
  if (!res.ok) throw new Error("Failed to fetch languages");
  const langs = await res.json();
  return langs.map((l: { name: string; id: number }) => ({
    language: l.name,
    version: "",
    aliases: [],
  }));
};
