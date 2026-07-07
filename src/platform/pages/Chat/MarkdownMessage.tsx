'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

const CodeBlock = ({ code, language }: { code: string; language: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{ backgroundColor: 'var(--bg-elevated)', borderBottom: '1px solid var(--border)' }}
      >
        <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
          {language || 'code'}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs transition-colors"
          style={{ color: copied ? '#22c55e' : 'var(--text-muted)' }}
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre
        className="p-4 text-sm font-mono overflow-x-auto leading-6"
        style={{ backgroundColor: '#0a0a0f', color: '#e8e8ff' }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
};

interface MarkdownMessageProps {
  content: string;
  isUser?: boolean;
}

export const MarkdownMessage = ({ content, isUser = false }: MarkdownMessageProps) => {
  if (isUser) {
    return <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>;
  }

  // Parse code blocks first
  const parts: Array<{ type: 'text' | 'code'; content: string; language?: string }> = [];
  const codeBlockRegex = /```(\w*)\n?([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: content.slice(lastIndex, match.index) });
    }
    parts.push({ type: 'code', content: match[2].trim(), language: match[1] });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < content.length) {
    parts.push({ type: 'text', content: content.slice(lastIndex) });
  }

  const renderText = (text: string) => {
    // Process inline formatting
    const lines = text.split('\n');
    return lines.map((line, i) => {
      if (!line.trim()) return <br key={i} />;

      // Bold + inline code
      const tokens = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
      const rendered = tokens.map((token, j) => {
        if (token.startsWith('**') && token.endsWith('**')) {
          return (
            <strong key={j} className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              {token.slice(2, -2)}
            </strong>
          );
        }
        if (token.startsWith('`') && token.endsWith('`')) {
          return (
            <code
              key={j}
              className="px-1.5 py-0.5 rounded text-xs font-mono"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                color: 'var(--accent-text)',
                border: '1px solid var(--border)',
              }}
            >
              {token.slice(1, -1)}
            </code>
          );
        }
        return <span key={j}>{token}</span>;
      });

      return (
        <p key={i} className="text-sm leading-relaxed mb-1">
          {rendered}
        </p>
      );
    });
  };

  return (
    <div className="space-y-1">
      {parts.map((part, i) =>
        part.type === 'code' ? (
          <CodeBlock key={i} code={part.content} language={part.language ?? ''} />
        ) : (
          <div key={i}>{renderText(part.content)}</div>
        ),
      )}
    </div>
  );
};
