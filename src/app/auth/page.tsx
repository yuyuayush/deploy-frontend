import React from 'react';
import { SignUpUI } from '@/components/SignUpUI';
import { Metadata } from 'next';
import { Shield, KeyRound, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Authentication Portal • Better Auth & Neon DB',
  description: 'Dedicated authentication portal with Email/Password and Google OAuth provider, backed by Neon PostgreSQL.',
};

export default function AuthPage() {
  return (
    <div className="py-8 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-3">
          <Sparkles size={14} /> Built with Better Auth & Neon PostgreSQL
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">
          Secure Authentication Portal
        </h1>
        <p className="text-sm text-slate-300 max-w-lg mx-auto">
          Sign in or create a new account using Email & Password or Google OAuth. Active user sessions are securely stored in Neon PostgreSQL database.
        </p>
      </div>

      {/* Main Dedicated Auth Form UI */}
      <SignUpUI defaultMode="signup" />
    </div>
  );
}
