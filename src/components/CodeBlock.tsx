'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  filename?: string;
  language?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, filename = 'page.tsx', language = 'typescript' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-box">
      <div className="code-header">
        <span>{filename} ({language})</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors bg-white/5 px-2 py-1 rounded"
        >
          {copied ? (
            <>
              <Check size={12} className="text-emerald-400" /> Copied!
            </>
          ) : (
            <>
              <Copy size={12} /> Copy Code
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto text-xs leading-relaxed font-mono text-slate-200">
        <code>{code}</code>
      </pre>
    </div>
  );
};
