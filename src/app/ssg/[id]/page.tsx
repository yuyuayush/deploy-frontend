import React from 'react';
import { getUserById, getUsersSSG } from '@/lib/api';
import { RenderingBadge } from '@/components/RenderingBadge';
import { CodeBlock } from '@/components/CodeBlock';
import { User, Mail, Calendar, Shield, ArrowLeft, Cpu } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const { users } = await getUsersSSG();
  return users.map((user) => ({
    id: user.id,
  }));
}

export default async function SSGDetailPage({ params }: { params: { id: string } }) {
  const user = await getUserById(params.id);

  if (!user) {
    notFound();
  }

  const codeExample = `// src/app/ssg/[id]/page.tsx
import { getUserById, getUsersSSG } from '@/lib/api';

// Pre-generate static HTML routes for all known user IDs during build
export async function generateStaticParams() {
  const { users } = await getUsersSSG();
  return users.map((user) => ({ id: user.id }));
}

export default async function SSGDetailPage({ params }: { params: { id: string } }) {
  const user = await getUserById(params.id);
  return <ProfileCard user={user} />;
}`;

  return (
    <div>
      <div className="mb-6">
        <Link href="/ssg" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={16} /> Back to SSG Overview
        </Link>
      </div>

      <section className="page-header">
        <div className="header-top">
          <RenderingBadge strategy="SSG" />
          <span className="text-xs text-emerald-400 font-mono">generateStaticParams() Pre-built Route</span>
        </div>
        <h1 className="page-title flex items-center gap-3">
          <Cpu className="text-emerald-500" size={32} />
          Static Profile: {user.name}
        </h1>
        <p className="page-description">
          This user profile route was statically compiled into a stand-alone HTML document during the build step using <code>generateStaticParams()</code>.
        </p>
      </section>

      {/* User Profile Card */}
      <section className="glass-panel p-8 mb-8 border-emerald-500/20 max-w-2xl">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center text-2xl font-bold text-emerald-300">
              {user.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-sm text-slate-300 flex items-center gap-1.5 mt-1">
                <Mail size={14} className="text-slate-400" /> {user.email}
              </p>
            </div>
          </div>
          <span className="badge-ssg px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
            <Shield size={12} /> {user.role}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm text-slate-300">
          <div className="glass-panel p-4">
            <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">User Identifier (UUID)</div>
            <div className="font-mono text-xs text-emerald-300 break-all">{user.id}</div>
          </div>
          <div className="glass-panel p-4">
            <div className="text-xs text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Calendar size={12} /> Created Timestamp
            </div>
            <div className="font-mono text-xs">{new Date(user.createdAt).toUTCString()}</div>
          </div>
        </div>
      </section>

      {/* Code Snippet Explanation */}
      <section className="glass-panel p-6">
        <h3 className="text-lg font-bold mb-2">Dynamic SSG Routing in App Router</h3>
        <p className="text-sm text-slate-300 mb-4">
          By defining <code>generateStaticParams()</code>, Next.js crawls the list of parameters, executes the fetch for each user, and outputs pre-baked HTML files (e.g. <code>/ssg/123e4567.../index.html</code>) at build time.
        </p>

        <CodeBlock code={codeExample} filename="src/app/ssg/[id]/page.tsx" />
      </section>
    </div>
  );
}
