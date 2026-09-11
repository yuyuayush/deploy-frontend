'use client';

import React, { useState } from 'react';
import { Copy, Check, Terminal, FileCode } from 'lucide-react';

const SNIPPETS = [
  {
    id: 'auth',
    filename: 'auth.ts',
    language: 'typescript',
    code: `import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
});`,
  },
  {
    id: 'client',
    filename: 'auth-client.ts',
    language: 'typescript',
    code: `import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "http://localhost:8080",
});

export const { useSession, signIn, signUp, signOut } = authClient;`,
  },
  {
    id: 'schema',
    filename: 'schema.ts',
    language: 'typescript',
    code: `import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").default(false),
});`,
  },
];

export const CodeTerminal: React.FC = () => {
  const [activeTab, setActiveTab] = useState(SNIPPETS[0].id);
  const [copied, setCopied] = useState(false);

  const currentSnippet = SNIPPETS.find((s) => s.id === activeTab) || SNIPPETS[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl overflow-hidden border border-white/10 bg-[#090b10] shadow-2xl shadow-indigo-500/10">
      {/* Terminal Bar Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0e1117] border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>

          <div className="flex items-center gap-1 ml-4 border-l border-white/10 pl-4">
            {SNIPPETS.map((snippet) => (
              <button
                key={snippet.id}
                onClick={() => setActiveTab(snippet.id)}
                className={`px-3 py-1 rounded-md text-xs font-mono transition-colors flex items-center gap-1.5 ${
                  activeTab === snippet.id
                    ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <FileCode size={12} />
                <span>{snippet.filename}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="btn btn-ghost btn-xs text-slate-400 hover:text-white font-mono gap-1"
        >
          {copied ? (
            <>
              <Check size={12} className="text-emerald-400" /> Copied
            </>
          ) : (
            <>
              <Copy size={12} /> Copy
            </>
          )}
        </button>
      </div>

      {/* Code Display Body */}
      <div className="p-4 font-mono text-xs leading-relaxed text-slate-200 overflow-x-auto bg-[#090b10]">
        <pre>
          <code>{currentSnippet.code}</code>
        </pre>
      </div>
    </div>
  );
};
