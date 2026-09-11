'use client';

import React, { useState } from 'react';
import { useSession, signIn, signUp, signOut } from '@/lib/auth-client';
import { LogIn, LogOut, UserPlus, Shield, Database, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export const AuthWidget: React.FC = () => {
  const { data: session, isPending } = useSession();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setAuthError(null);
    try {
      await signIn.social({
        provider: 'google',
        callbackURL: '/',
      });
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Google login failed');
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);

    try {
      if (isSignUp) {
        const res = await signUp.email({
          email,
          password,
          name,
        });
        if (res.error) {
          setAuthError(res.error.message || 'Registration failed');
        }
      } else {
        const res = await signIn.email({
          email,
          password,
        });
        if (res.error) {
          setAuthError(res.error.message || 'Invalid email or password');
        }
      }
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Authentication error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    await signOut();
    setLoading(false);
  };

  if (isPending) {
    return (
      <div className="glass-panel p-4 text-xs text-slate-400 flex items-center gap-2">
        <RefreshCw size={14} className="animate-spin text-indigo-400" />
        Checking Better Auth session state...
      </div>
    );
  }

  if (session?.user) {
    return (
      <div className="glass-panel p-4 border-indigo-500/30">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-300">
              {session.user.name ? session.user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">{session.user.name || 'Authenticated User'}</span>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                  <Database size={10} /> Neon DB Active
                </span>
              </div>
              <p className="text-xs text-slate-400">{session.user.email}</p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            disabled={loading}
            className="btn btn-secondary text-xs py-1.5 flex items-center gap-1.5"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel p-5 border-indigo-500/30">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Shield className="text-indigo-400" size={18} />
          <h3 className="font-bold text-sm">Better Auth • Neon Postgres & Google OAuth</h3>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/auth/signup" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1">
            Dedicated Auth Portal <ExternalLink size={12} />
          </Link>
        </div>
      </div>

      {authError && (
        <div className="mb-3 p-2.5 rounded text-xs bg-rose-500/10 text-rose-300 border border-rose-500/20 flex items-center gap-2">
          <AlertCircle size={14} /> {authError}
        </div>
      )}

      {/* Google Provider Button */}
      <div className="mb-3">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
          className="w-full py-2 px-3 rounded bg-white/10 hover:bg-white/15 border border-white/15 transition-all flex items-center justify-center gap-2 text-xs font-semibold text-white"
        >
          {googleLoading ? (
            <RefreshCw size={14} className="animate-spin text-indigo-400" />
          ) : (
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
          )}
          <span>Sign In with Google</span>
        </button>
      </div>

      <div className="relative flex items-center justify-center my-3">
        <div className="border-t border-white/10 w-full" />
        <span className="bg-[#121824] px-2 text-[9px] text-slate-400 uppercase tracking-widest absolute">
          Or Email
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {isSignUp && (
          <div className="form-group mb-0">
            <label className="form-label text-xs">Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Alex Rivera"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input text-xs py-1.5"
            />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="form-group mb-0">
            <label className="form-label text-xs">Email Address</label>
            <input
              type="email"
              required
              placeholder="alex@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input text-xs py-1.5"
            />
          </div>

          <div className="form-group mb-0">
            <label className="form-label text-xs">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input text-xs py-1.5"
            />
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-indigo-400 hover:text-indigo-300"
          >
            {isSignUp ? 'Existing user? Sign In' : 'New user? Register'}
          </button>

          <button type="submit" disabled={loading} className="btn btn-primary text-xs py-1.5">
            {loading ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : isSignUp ? (
              <>
                <UserPlus size={14} /> Register
              </>
            ) : (
              <>
                <LogIn size={14} /> Sign In
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
