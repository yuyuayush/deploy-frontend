import React from 'react';
import { getUsersSSR } from '@/lib/api';
import { RenderingBadge } from '@/components/RenderingBadge';
import { UserCard } from '@/components/UserCard';
import { CodeBlock } from '@/components/CodeBlock';
import { Server, Clock, Zap, Database, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function SSRPage() {
  const { users, meta, latencyMs } = await getUsersSSR();

  const codeExample = `// src/app/ssr/page.tsx
import { getUsersSSR } from '@/lib/api';

// Explicitly instruct Next.js App Router to dynamically render on EVERY request
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function SSRPage() {
  // Fetch fresh data from backend on the server with cache: 'no-store'
  const { users, meta, latencyMs } = await getUsersSSR();

  return (
    <div>
      <h1>Server Timestamp: {meta.formattedTime}</h1>
      <p>Fetch Latency: {latencyMs} ms</p>
      <UserGrid users={users} />
    </div>
  );
}`;

  return (
    <div>
      {/* Header */}
      <section className="page-header">
        <div className="header-top">
          <RenderingBadge strategy="SSR" />
          <span className="text-xs text-slate-400 font-mono">Dynamic On-Demand Rendering</span>
        </div>
        <h1 className="page-title flex items-center gap-3">
          <Server className="text-pink-500" size={32} />
          Server-Side Rendering (SSR)
        </h1>
        <p className="page-description">
          This page is dynamically executed and rendered on the server for every single incoming HTTP request. Next.js fetches fresh data with <code>cache: &apos;no-store&apos;</code>.
        </p>
      </section>

      {/* Telemetry Metrics Bar */}
      <section className="telemetry-grid">
        <div className="glass-panel telemetry-card border-pink-500/30">
          <div className="telemetry-label flex items-center gap-1 text-pink-400">
            <Clock size={14} /> Server Generation Time
          </div>
          <div className="telemetry-value text-pink-300">{meta.formattedTime}</div>
          <div className="telemetry-subtext">Updated live on every page refresh</div>
        </div>

        <div className="glass-panel telemetry-card">
          <div className="telemetry-label flex items-center gap-1 text-indigo-400">
            <Zap size={14} /> Fetch Latency
          </div>
          <div className="telemetry-value">{latencyMs} ms</div>
          <div className="telemetry-subtext">Server-to-API roundtrip time</div>
        </div>

        <div className="glass-panel telemetry-card">
          <div className="telemetry-label flex items-center gap-1 text-emerald-400">
            <Database size={14} /> Data Source
          </div>
          <div className="telemetry-value uppercase text-base">{meta.source}</div>
          <div className="telemetry-subtext">{users.length} Records fetched</div>
        </div>

        <div className="glass-panel telemetry-card flex flex-col justify-between">
          <div className="telemetry-label">Live Refresh Test</div>
          <Link href="/ssr" replace className="btn btn-primary text-xs w-full py-2">
            <RefreshCw size={14} className="animate-spin-slow" />
            Reload SSR Page Now
          </Link>
          <div className="telemetry-subtext text-center mt-1">Generates fresh server HTML</div>
        </div>
      </section>

      {/* User Grid */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span>Server-Fetched User Records</span>
            <span className="text-xs font-normal text-slate-400">({users.length} total)</span>
          </h2>
          <span className="text-xs text-pink-400 font-mono bg-pink-500/10 px-2 py-1 rounded border border-pink-500/20">
            HTTP Cache: no-store
          </span>
        </div>

        <div className="user-grid">
          {users.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      </section>

      {/* Code Snippet Explanation */}
      <section className="glass-panel p-6">
        <h3 className="text-lg font-bold mb-2">How SSR Works in Next.js App Router</h3>
        <p className="text-sm text-slate-300 mb-4">
          When a request arrives at the server, Next.js executes the page component, executes all uncached backend <code>fetch()</code> calls, constructs the full HTML response document, and streams it back to the client browser with <code>Cache-Control: private, no-cache, no-store, must-revalidate</code> headers.
        </p>

        <CodeBlock code={codeExample} filename="src/app/ssr/page.tsx" />
      </section>
    </div>
  );
}
