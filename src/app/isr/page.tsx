import React from 'react';
import { getUsersISR } from '@/lib/api';
import { RenderingBadge } from '@/components/RenderingBadge';
import { UserCard } from '@/components/UserCard';
import { CodeBlock } from '@/components/CodeBlock';
import { IsrRevalidateButton } from '@/components/IsrRevalidateButton';
import { RefreshCw, Clock, Zap, ShieldCheck } from 'lucide-react';

export const revalidate = 10; // Time-based revalidation every 10 seconds

export default async function ISRPage() {
  const { users, meta, latencyMs } = await getUsersISR(10);

  const codeExample = `// src/app/isr/page.tsx
import { getUsersISR } from '@/lib/api';

// Set incremental static revalidation window to 10 seconds
export const revalidate = 10;

export default async function ISRPage() {
  // Uses fetch next: { revalidate: 10, tags: ['users'] }
  const { users, meta } = await getUsersISR(10);

  return (
    <div>
      <h1>Last Generated: {meta.formattedTime}</h1>
      <UserGrid users={users} />
    </div>
  );
}`;

  return (
    <div>
      {/* Header */}
      <section className="page-header">
        <div className="header-top">
          <RenderingBadge strategy="ISR" revalidateTime={10} />
          <span className="text-xs text-slate-400 font-mono">Stale-While-Revalidate Caching</span>
        </div>
        <h1 className="page-title flex items-center gap-3">
          <RefreshCw className="text-blue-500" size={32} />
          Incremental Static Regeneration (ISR)
        </h1>
        <p className="page-description">
          ISR combines static performance with background auto-updates. Next.js serves cached static HTML while regenerating the page in the background every 10 seconds or on-demand via Server Actions.
        </p>
      </section>

      {/* Telemetry Metrics Bar */}
      <section className="telemetry-grid">
        <div className="glass-panel telemetry-card border-blue-500/30">
          <div className="telemetry-label flex items-center gap-1 text-blue-400">
            <Clock size={14} /> Page Cache Timestamp
          </div>
          <div className="telemetry-value text-blue-300">{meta.formattedTime}</div>
          <div className="telemetry-subtext">Stale-while-revalidate window: 10s</div>
        </div>

        <div className="glass-panel telemetry-card">
          <div className="telemetry-label flex items-center gap-1 text-indigo-400">
            <Zap size={14} /> Cached Response Latency
          </div>
          <div className="telemetry-value text-blue-400">{latencyMs || '< 15'} ms</div>
          <div className="telemetry-subtext">Instant static payload execution</div>
        </div>

        <div className="glass-panel telemetry-card">
          <div className="telemetry-label flex items-center gap-1 text-emerald-400">
            <ShieldCheck size={14} /> Cache Strategy
          </div>
          <div className="telemetry-value text-base">STALE-WHILE-REVALIDATE</div>
          <div className="telemetry-subtext">Tag: &apos;users&apos; bound to cache</div>
        </div>

        <div className="glass-panel telemetry-card">
          <div className="telemetry-label text-blue-400">Auto Refresh Timer</div>
          <div className="telemetry-value text-sm font-normal text-slate-200">10 Seconds</div>
          <div className="telemetry-subtext">Background worker revalidates after 10s</div>
        </div>
      </section>

      {/* On Demand Action Banner */}
      <section className="mb-8">
        <IsrRevalidateButton />
      </section>

      {/* User Grid */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span>ISR Static User Records</span>
            <span className="text-xs font-normal text-slate-400">({users.length} items)</span>
          </h2>
          <span className="text-xs text-blue-400 font-mono bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20">
            next: &#123; revalidate: 10 &#125;
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
        <h3 className="text-lg font-bold mb-2">How ISR Works in Next.js App Router</h3>
        <p className="text-sm text-slate-300 mb-4">
          1. Initial request receives the cached static page.<br />
          2. Any requests within 10 seconds also receive the cached static page.<br />
          3. After 10 seconds, the next request STILL receives the cached page, but Next.js triggers a background regeneration.<br />
          4. Once regenerated, Next.js replaces the static cache file transparently!
        </p>

        <CodeBlock code={codeExample} filename="src/app/isr/page.tsx" />
      </section>
    </div>
  );
}
