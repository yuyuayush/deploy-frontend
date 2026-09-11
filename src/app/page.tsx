import React from 'react';
import Link from 'next/link';
import { ArrowRight, Rss, ShieldCheck, Zap, Sparkles, Code2, Users, Database, Star, Github, CheckCircle2 } from 'lucide-react';
import { ThreeCanvas } from '@/components/ThreeCanvas';
import { CodeTerminal } from '@/components/CodeTerminal';

export default function LandingPage() {
  return (
    <div className="space-y-20 py-4">
      {/* Better Auth Website Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-6 pt-4">
        {/* Top Glow Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 shadow-lg shadow-indigo-500/10">
          <Sparkles size={14} className="text-indigo-400" />
          <span>The Comprehensive Authentication Framework for TypeScript</span>
        </div>

        {/* Massive Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Authentication for TypeScript. <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400 -webkit-background-clip-text text-transparent">
            Built for Modern Web Apps.
          </span>
        </h1>

        {/* Sub-headline */}
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Framework-agnostic, serverless-ready authentication library for Next.js, Express, and Neon PostgreSQL. Supports Google OAuth, email verification, and session management.
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4 flex-wrap pt-2">
          <Link href="/feed" className="btn btn-primary text-xs sm:text-sm font-semibold gap-2 shadow-lg shadow-indigo-500/30 px-6 py-2.5">
            <Rss size={16} /> Explore Feed <ArrowRight size={16} />
          </Link>
          <Link href="/auth" className="btn btn-outline border-white/20 text-white hover:bg-white/10 text-xs sm:text-sm font-semibold px-6 py-2.5">
            <ShieldCheck size={16} /> Get Started / Auth Portal
          </Link>
        </div>
      </section>

      {/* Code Terminal & 3D Interactive Showcase */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto">
        <div className="lg:col-span-7">
          <CodeTerminal />
        </div>

        <div className="lg:col-span-5 relative w-full h-[340px] rounded-2xl glass-panel overflow-hidden border border-indigo-500/20 shadow-2xl shadow-indigo-500/10">
          <ThreeCanvas />
          <div className="absolute bottom-3 left-3 right-3 text-center text-[10px] font-mono text-slate-400 bg-black/40 backdrop-blur-md py-1 px-3 rounded-md border border-white/5">
            Interactive WebGL 3D Mesh • Move cursor to rotate
          </div>
        </div>
      </section>

      {/* Feature Matrix (better-auth.com style) */}
      <section className="space-y-8 max-w-6xl mx-auto">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Everything you need for Authentication
          </h2>
          <p className="text-xs text-slate-400 mt-2">
            Batteries-included authentication suite with zero-config defaults and total flexibility.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-[#0b0e14] border border-white/10 hover:border-indigo-500/40 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <ShieldCheck size={20} />
            </div>
            <h3 className="text-base font-bold text-white">Email & Password</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Built-in password hashing, automatic session tokens, and instant sign-in handling.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0b0e14] border border-white/10 hover:border-cyan-500/40 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
              <Sparkles size={20} />
            </div>
            <h3 className="text-base font-bold text-white">Google OAuth 2.0</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              One-click social login provider support with automatic profile syncing.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0b0e14] border border-white/10 hover:border-purple-500/40 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <Database size={20} />
            </div>
            <h3 className="text-base font-bold text-white">Neon PostgreSQL</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Drizzle ORM schema adapter with serverless PostgreSQL connection pooling.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0b0e14] border border-white/10 hover:border-emerald-500/40 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Zap size={20} />
            </div>
            <h3 className="text-base font-bold text-white">Next.js App Router</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Hybrid rendering architecture supporting SSR, SSG, ISR, and CSR modes.
            </p>
          </div>
        </div>
      </section>

      {/* Community CTA Section */}
      <section className="rounded-3xl bg-gradient-to-r from-indigo-950/40 via-[#0c0f17] to-purple-950/40 border border-indigo-500/30 p-10 text-center space-y-4 max-w-4xl mx-auto shadow-2xl">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Start Building Today</h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
          Experience authentication built for the modern Web stack. Sign in or register to start exploring the community stream.
        </p>
        <div className="pt-2 flex items-center justify-center gap-4">
          <Link href="/auth" className="btn btn-primary btn-md text-xs gap-2 px-6">
            Get Started Now <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
