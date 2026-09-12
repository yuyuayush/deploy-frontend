'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSession, signIn, signUp, signOut } from '@/lib/auth-client';
import { Shield, Lock, Mail, User, CheckCircle2, AlertCircle, RefreshCw, LogOut, ArrowRight, Eye, EyeOff, Database, KeyRound, Sparkles, Zap, LockKeyhole } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface SignUpUIProps {
  defaultMode?: 'signup' | 'signin';
  redirectUrl?: string;
}

function SignUpFormContent({ defaultMode = 'signup', redirectUrl = '/feed' }: SignUpUIProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending } = useSession();
  
  const initialMode = (searchParams?.get('mode') as 'signup' | 'signin') || defaultMode;
  const [mode, setMode] = useState<'signup' | 'signin'>(initialMode);

  useEffect(() => {
    const modeParam = searchParams?.get('mode');
    if (modeParam === 'signin' || modeParam === 'signup') {
      setMode(modeParam);
    }
  }, [searchParams]);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Loading & Error States
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Password Strength Calculator
  const calculatePasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score += 25;
    if (/[A-Z]/.test(pass)) score += 25;
    if (/[0-9]/.test(pass)) score += 25;
    if (/[^A-Za-z0-9]/.test(pass)) score += 25;
    return score;
  };

  const passwordScore = calculatePasswordStrength(password);

  const getStrengthColor = (score: number) => {
    if (score <= 25) return 'bg-rose-500';
    if (score <= 50) return 'bg-amber-500';
    if (score <= 75) return 'bg-blue-500';
    return 'bg-emerald-500';
  };

  const getStrengthText = (score: number) => {
    if (score <= 0) return '';
    if (score <= 25) return 'Weak';
    if (score <= 50) return 'Fair';
    if (score <= 75) return 'Good';
    return 'Strong';
  };

  // Google OAuth Login Trigger
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setErrorMsg(null);
    try {
      await signIn.social({
        provider: 'google',
        callbackURL: redirectUrl,
      });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Google authentication failed');
      setGoogleLoading(false);
    }
  };

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.');
        return;
      }
      if (password.length < 8) {
        setErrorMsg('Password must be at least 8 characters long.');
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === 'signup') {
        const res = await signUp.email({
          email,
          password,
          name,
        });

        if (res.error) {
          setErrorMsg(res.error.message || 'Registration failed');
        } else {
          setSuccessMsg('Account created successfully! Redirecting to feed...');
          setTimeout(() => router.push('/feed'), 500);
        }
      } else {
        const res = await signIn.email({
          email,
          password,
        });

        if (res.error) {
          setErrorMsg(res.error.message || 'Invalid email or password');
        } else {
          setSuccessMsg('Successfully signed in! Redirecting to feed...');
          setTimeout(() => router.push('/feed'), 500);
        }
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'An authentication error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="glass-panel p-12 text-center text-slate-400 max-w-md mx-auto">
        <RefreshCw size={32} className="animate-spin mx-auto text-indigo-400 mb-3" />
        <p className="text-sm font-medium">Verifying Session State with Neon DB...</p>
      </div>
    );
  }

  // Active Authenticated State
  if (session?.user) {
    return (
      <div className="glass-panel p-8 max-w-lg mx-auto border-indigo-500/30 text-center shadow-2xl">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 p-1 mx-auto mb-4 shadow-lg shadow-indigo-500/30">
          <div className="w-full h-full rounded-full bg-[#0a0d14] flex items-center justify-center font-extrabold text-3xl text-indigo-300">
            {session.user.name ? session.user.name.charAt(0).toUpperCase() : 'U'}
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-1 text-white">{session.user.name || 'Authenticated User'}</h2>
        <p className="text-sm text-slate-300 mb-4">{session.user.email}</p>

        <div className="glass-panel p-3 mb-6 text-xs text-emerald-300 bg-emerald-500/10 border-emerald-500/20 flex items-center justify-center gap-2">
          <Database size={16} />
          <span>Active Better Auth Session Synced to Neon PostgreSQL</span>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Link href="/" className="btn btn-primary text-xs py-2.5 px-5">
            Return to Dashboard <ArrowRight size={14} />
          </Link>
          <button onClick={() => signOut()} className="btn btn-secondary text-xs py-2.5 px-5">
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-hero-container grid grid-cols-1 lg:grid-cols-12 max-w-5xl mx-auto my-4">
      {/* Left Visual Branding Hero Pane */}
      <div className="auth-hero-left lg:col-span-5 p-8 lg:p-10 flex flex-col justify-between hidden sm:flex">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shimmer-badge text-indigo-300 border border-indigo-500/30 mb-6">
            <Sparkles size={14} /> NextEngine Auth Studio
          </div>

          <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white mb-3 leading-tight">
            Enterprise Identity & Auth Suite
          </h2>

          <p className="text-xs text-slate-300 leading-relaxed mb-6">
            Unified authentication powered by Better Auth, Google OAuth 2.0, and serverless Neon PostgreSQL.
          </p>

          <div className="space-y-3 text-xs text-slate-200">
            <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/5 border border-white/5">
              <Zap size={16} className="text-indigo-400 shrink-0" />
              <span>Sub-10ms Session Cookie Verification</span>
            </div>
            <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/5 border border-white/5">
              <Database size={16} className="text-cyan-400 shrink-0" />
              <span>Neon DB Serverless Storage Sync</span>
            </div>
            <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/5 border border-white/5">
              <LockKeyhole size={16} className="text-emerald-400 shrink-0" />
              <span>Google OAuth & Encrypted Passwords</span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Better Auth v1.1</span>
          <span>Neon Postgres SSL</span>
        </div>
      </div>

      {/* Right Form Interactive Pane */}
      <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 bg-[#0c1017]">
        {/* Mode Switcher Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <div>
            <h3 className="text-xl font-extrabold tracking-tight text-white">
              {mode === 'signup' ? 'Create Account' : 'Sign In'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {mode === 'signup' ? 'Get started with Google or Email' : 'Access your authenticated session'}
            </p>
          </div>

          <div className="flex bg-white/5 p-1 rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => { setMode('signup'); setErrorMsg(null); }}
              className={`px-3 py-1.5 rounded-md transition-all ${
                mode === 'signup' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => { setMode('signin'); setErrorMsg(null); }}
              className={`px-3 py-1.5 rounded-md transition-all ${
                mode === 'signin' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Google Social Provider Button */}
        <div className="mb-5">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="google-btn-premium w-full py-3 px-4 flex items-center justify-center gap-3 text-xs font-semibold text-white shadow-sm"
          >
            {googleLoading ? (
              <RefreshCw size={16} className="animate-spin text-indigo-400" />
            ) : (
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center mb-5">
          <div className="border-t border-white/10 w-full" />
          <span className="bg-[#0c1017] px-3 text-[10px] text-slate-400 uppercase tracking-widest absolute">
            Or Email Credentials
          </span>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg text-xs bg-rose-500/10 text-rose-300 border border-rose-500/20 flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-lg text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-2">
            <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="form-group mb-0">
              <label className="form-label text-xs">Full Name</label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Rivera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-premium text-xs pl-9 py-2.5 w-full"
                />
              </div>
            </div>
          )}

          <div className="form-group mb-0">
            <label className="form-label text-xs">Email Address</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                placeholder="alex@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-premium text-xs pl-9 py-2.5 w-full"
              />
            </div>
          </div>

          <div className="form-group mb-0">
            <label className="form-label text-xs">Password</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-premium text-xs pl-9 pr-9 py-2.5 w-full"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {mode === 'signup' && password.length > 0 && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Password Complexity</span>
                  <span className="font-semibold text-slate-300">{getStrengthText(passwordScore)}</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${getStrengthColor(passwordScore)}`}
                    style={{ width: `${passwordScore}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {mode === 'signup' && (
            <div className="form-group mb-0">
              <label className="form-label text-xs">Confirm Password</label>
              <div className="relative">
                <KeyRound size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-premium text-xs pl-9 py-2.5 w-full"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary text-xs w-full py-3 mt-2 bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-lg shadow-indigo-600/30"
          >
            {loading ? (
              <RefreshCw size={16} className="animate-spin" />
            ) : mode === 'signup' ? (
              <>
                Create Account & Sync to Neon DB <ArrowRight size={14} />
              </>
            ) : (
              <>
                Sign In <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-white/10 text-center">
          <p className="text-[11px] text-slate-400">
            Protected by Better Auth & Neon PostgreSQL Encryption.
          </p>
        </div>
      </div>
    </div>
  );
}

export const SignUpUI: React.FC<SignUpUIProps> = (props) => {
  return (
    <Suspense fallback={
      <div className="glass-panel p-12 text-center text-slate-400 max-w-md mx-auto">
        <RefreshCw size={32} className="animate-spin mx-auto text-indigo-400 mb-3" />
        <p className="text-sm font-medium">Loading Auth Studio...</p>
      </div>
    }>
      <SignUpFormContent {...props} />
    </Suspense>
  );
};
