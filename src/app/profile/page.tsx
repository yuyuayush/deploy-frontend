'use client';

import React from 'react';
import { useSession, signOut } from '@/lib/auth-client';
import { User, Mail, Calendar, Shield, Database, LogOut, ArrowRight, KeyRound, CheckCircle2, Lock, Sparkles, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="glass-panel p-12 text-center text-slate-400 max-w-md mx-auto my-12">
        <RefreshCw size={28} className="animate-spin mx-auto text-indigo-400 mb-3" />
        <p className="text-sm font-medium">Fetching User Session from Express Backend...</p>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="glass-panel p-12 text-center max-w-md mx-auto my-12 border-rose-500/20">
        <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
          <Lock size={24} />
        </div>
        <h2 className="text-xl font-bold mb-2">Authentication Required</h2>
        <p className="text-xs text-slate-300 mb-6">
          You must be signed in to access the user profile and session telemetry dashboard.
        </p>
        <Link href="/auth" className="btn btn-primary text-xs py-2 px-6">
          Go to Sign In / Sign Up <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  const user = session.user;
  const userInitial = user.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="max-w-4xl mx-auto py-6">
      {/* Page Title */}
      <section className="page-header mb-6">
        <div className="header-top">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1.5">
            <Sparkles size={14} /> Active Session Verified
          </span>
        </div>
        <h1 className="page-title flex items-center gap-3">
          <User className="text-indigo-400" size={32} />
          User Profile & Session Telemetry
        </h1>
        <p className="page-description">
          Session token and identity records managed by Better Auth, Drizzle ORM, and Neon PostgreSQL database.
        </p>
      </section>

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Left Profile Overview Card */}
        <div className="glass-panel p-6 border-indigo-500/30 text-center flex flex-col items-center justify-between">
          <div>
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 p-1 mx-auto mb-4 shadow-xl shadow-indigo-500/25">
              <div className="w-full h-full rounded-full bg-[#0a0d14] flex items-center justify-center font-extrabold text-4xl text-indigo-300">
                {userInitial}
              </div>
            </div>

            <h2 className="text-xl font-bold text-white mb-1">{user.name || 'Authenticated User'}</h2>
            <p className="text-xs text-slate-300 flex items-center justify-center gap-1 mb-4">
              <Mail size={12} className="text-slate-400" /> {user.email}
            </p>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 mb-4">
              <CheckCircle2 size={12} /> Verified User
            </div>
          </div>

          <button onClick={() => signOut()} className="btn btn-secondary text-xs w-full py-2">
            <LogOut size={14} /> Sign Out Session
          </button>
        </div>

        {/* Right Session Details Card */}
        <div className="glass-panel p-6 border-indigo-500/30 md:col-span-2 space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2 border-b border-white/10 pb-3">
            <KeyRound size={18} className="text-indigo-400" /> Session Security Metadata
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="glass-panel p-3.5 bg-white/5">
              <span className="text-slate-400 uppercase tracking-wider text-[10px] block mb-1">User Identifier</span>
              <span className="font-mono text-indigo-300 break-all">{user.id || 'N/A'}</span>
            </div>

            <div className="glass-panel p-3.5 bg-white/5">
              <span className="text-slate-400 uppercase tracking-wider text-[10px] block mb-1">Database Provider</span>
              <span className="font-semibold text-emerald-400 flex items-center gap-1">
                <Database size={12} /> Neon PostgreSQL (Serverless)
              </span>
            </div>

            <div className="glass-panel p-3.5 bg-white/5">
              <span className="text-slate-400 uppercase tracking-wider text-[10px] block mb-1">ORM & Auth Engine</span>
              <span className="font-semibold text-slate-200">Better Auth + Drizzle ORM</span>
            </div>

            <div className="glass-panel p-3.5 bg-white/5">
              <span className="text-slate-400 uppercase tracking-wider text-[10px] block mb-1">Backend Server</span>
              <span className="font-semibold text-cyan-300 font-mono">Express Node (Port 8080)</span>
            </div>
          </div>

          <div className="pt-2 text-xs text-slate-400">
            <p>
              Your session cookie is encrypted and validated on every request between Next.js (Port 3000) and Express Backend (Port 8080).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
