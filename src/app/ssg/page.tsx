import React from 'react';
import { getUsersSSG } from '@/lib/api';
import { RenderingBadge } from '@/components/RenderingBadge';
import { UserCard } from '@/components/UserCard';
import { CodeBlock } from '@/components/CodeBlock';
import { Cpu, Clock, Zap, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-static';

export default async function SSGPage() {
  const { users, meta, latencyMs } = await getUsersSSG();

  const codeExample = `// src/app/ssg/page.tsx
import { getUsersSSG } from '@/lib/api';

// Enforce Static Generation (SSG / SGR)
export const dynamic = 'force-static';

export default async function SSGPage() {
  // Pre-rendered at build time with cache: 'force-cache'
  const { users, meta } = await getUsersSSG();

  return (
    <div>
      <h1>Build Timestamp: {meta.formattedTime}</h1>
      <UserGrid users={users} />
    </div>
  );
}`;

  return (
    <div>
      {/* Header */}
      <section className="page-header">
        <div className="header-top">
          <RenderingBadge strategy="SSG" />
          <span className="text-xs text-slate-400 font-mono">Build-Time Pre-rendering</span>
        </div>
        <h1 className="page-title flex items-center gap-3">
          <Cpu className="text-emerald-500" size={32} />
          Static Site Generation (SSG / SGR)
        </h1>
        <p className="page-description">
          This page was HTML pre-rendered at build time. Served with zero server-side computational overhead instantly from edge CDN caching.
        </p>
      </section>

      {/* Telemetry Metrics Bar */}
      <section className="telemetry-grid">
        <div className="glass-panel telemetry-card border-emerald-500/30">
          <div className="telemetry-label flex items-center gap-1 text-emerald-400">
            <Clock size={14} /> Static Build Snapshot Time
          </div>
          <div className="telemetry-value text-emerald-300">{meta.formattedTime}</div>
          <div className="telemetry-subtext">Static timestamp frozen at build time</div>
        </div>

        <div className="glass-panel telemetry-card">
          <div className="telemetry-label flex items-center gap-1 text-indigo-400">
            <Zap size={14} /> Latency Speed
          </div>
          <div className="telemetry-value text-emerald-400">{latencyMs || '< 5'} ms</div>
          <div className="telemetry-subtext">Instant CDN payload response</div>
        </div>

        <div className="glass-panel telemetry-card">
          <div className="telemetry-label flex items-center gap-1 text-emerald-400">
            <ShieldCheck size={14} /> Edge Cache Header
          </div>
          <div className="telemetry-value text-base">HIT (FORCE-CACHE)</div>
          <div className="telemetry-subtext">Zero database/API queries per request</div>
        </div>

        <div className="glass-panel telemetry-card flex flex-col justify-between">
          <div className="telemetry-label">Static Profile Navigation</div>
          <Link href={`/ssg/${users[0]?.id || '123e4567-e89b-12d3-a456-426614174000'}`} className="btn btn-secondary text-xs w-full py-2">
            View Static Profile Page &rarr;
          </Link>
          <div className="telemetry-subtext text-center mt-1">Pre-rendered with generateStaticParams</div>
        </div>
      </section>

      {/* User Grid */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span>Statically Generated Users</span>
            <span className="text-xs font-normal text-slate-400">({users.length} pre-rendered)</span>
          </h2>
          <span className="text-xs text-emerald-400 font-mono bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
            HTTP Cache: force-cache
          </span>
        </div>

        <div className="user-grid">
          {users.map((user) => (
            <UserCard key={user.id} user={user} showDetailsLink={true} />
          ))}
        </div>
      </section>

      {/* Code Snippet Explanation */}
      <section className="glass-panel p-6">
        <h3 className="text-lg font-bold mb-2">How SSG Works in Next.js App Router</h3>
        <p className="text-sm text-slate-300 mb-4">
          During <code>next build</code>, Next.js executes the page component, fetches static data once, compiles the HTML output to disk, and uploads the static artifact. Subsequent requests receive the cached static file instantly without hitting backend application servers.
        </p>

        <CodeBlock code={codeExample} filename="src/app/ssg/page.tsx" />
      </section>
    </div>
  );
}
