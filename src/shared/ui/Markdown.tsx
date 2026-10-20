'use client';

import { Children, isValidElement, type ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { InteractiveCode, resolveLanguage } from './InteractiveCode';

// ─── Markdown renderer for v2 Sanity content ─────────────────────────────────
// v2 lesson/module/course `body` fields are Markdown strings. Styling mirrors
// the old Portable Text components (headings, macOS code windows, quotes).

const CodeWindow = ({ language, code }: { language?: string; code: string }) => (
  <div className="my-5 rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
    <div
      className="flex items-center justify-between px-4 py-2 border-b"
      style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)' }}
    >
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
      </div>
      {language && (
        <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
          {language}
        </span>
      )}
    </div>
    <pre
      className="p-4 text-sm overflow-x-auto font-mono leading-6"
      style={{ backgroundColor: '#0a0a0f', color: '#e8e8ff' }}
    >
      <code>{code}</code>
    </pre>
  </div>
);

export const Markdown = ({ content, rtl = false, interactive = false }: { content?: string; rtl?: boolean; interactive?: boolean }) => {
  if (!content?.trim()) return null;
  return (
    <div className={`max-w-none ${rtl ? 'text-right' : 'text-left'}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold mt-8 mb-4" style={{ color: 'var(--text-primary)' }}>{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-bold mt-6 mb-3" style={{ color: 'var(--text-primary)' }}>{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-semibold mt-5 mb-2" style={{ color: 'var(--text-primary)' }}>{children}</h3>
          ),
          p: ({ children }) => (
            <p className="text-sm leading-7 mb-4" style={{ color: 'var(--text-secondary)' }}>{children}</p>
          ),
          blockquote: ({ children }) => (
            <blockquote
              className="border-l-4 pl-4 my-4 italic text-sm"
              style={{ borderColor: 'var(--accent)', color: 'var(--text-secondary)', backgroundColor: 'var(--accent-subtle)' }}
            >
              <div className="py-2">{children}</div>
            </blockquote>
          ),
          code: ({ children, className }) => {
            const match = /language-(\w+)/.exec(className || '');
            // Block code is handled by `pre` below; this styles inline code.
            if (!match && !className) {
              return (
                <code
                  className="px-1.5 py-0.5 rounded text-xs font-mono"
                  style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--accent-text)', border: '1px solid var(--border)' }}
                >
                  {children}
                </code>
              );
            }
            return <code className={className}>{children}</code>;
          },
          pre: ({ children }) => {
            // Extract language + raw code from the rendered <code> child.
            const extract = (node: ReactNode): { language?: string; code: string } => {
              if (isValidElement<{ children?: ReactNode; className?: string }>(node)) {
                const cls = node.props.className || '';
                const match = /language-([\w+-]+)/.exec(cls);
                const raw = Children.toArray(node.props.children).join('');
                return { language: match?.[1], code: String(raw).replace(/\n$/, '') };
              }
              return { code: '' };
            };
            const kids = Children.toArray(children);
            if (kids.length === 1) {
              const { language, code } = extract(kids[0]);
              // Interactive mode turns runnable fences into editable, runnable
              // editors (lesson body). Other callers keep the static window.
              if (interactive && language && resolveLanguage(language)) {
                return <InteractiveCode language={language} code={code} />;
              }
              return <CodeWindow language={language} code={code} />;
            }
            return <pre>{children}</pre>;
          },
          ul: ({ children }) => (
            <ul className="list-disc ps-5 mb-4 space-y-1 text-sm" style={{ color: 'var(--text-secondary)' }}>{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal ps-5 mb-4 space-y-1 text-sm" style={{ color: 'var(--text-secondary)' }}>{children}</ol>
          ),
          li: ({ children }) => <li className="leading-7">{children}</li>,
          table: ({ children }) => (
            <div className="my-4 overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--border)' }}>
              <table className="w-full text-sm" style={{ color: 'var(--text-secondary)' }}>{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="px-3 py-2 text-left text-xs font-bold" style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)', borderBottom: '1px solid var(--border)' }}>{children}</th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-2" style={{ borderBottom: '1px solid var(--border)' }}>{children}</td>
          ),
          a: ({ children, href }) => (
            <a href={href} target="_blank" rel="noreferrer" className="underline" style={{ color: 'var(--accent-text)' }}>{children}</a>
          ),
          hr: () => <hr className="my-6" style={{ borderColor: 'var(--border)' }} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
