'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSession, signOut } from '@/lib/auth-client';
import { User, LogOut, Shield, ChevronDown, Database, KeyRound, Clock, BellOff, Check } from 'lucide-react';
import Link from 'next/link';
import { triggerTestEmail } from '@/lib/api';

export const UserNavDropdown: React.FC = () => {
  const { data: session, isPending } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [testEmailStatus, setTestEmailStatus] = useState<string | null>(null);
  const [triggering, setTriggering] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTriggerTestEmail = async () => {
    if (!session?.user?.email || triggering) return;
    setTriggering(true);
    setTestEmailStatus(null);

    try {
      const res = await triggerTestEmail(session.user.email, session.user.name || 'Developer', 60000);
      if (res.success) {
        setTestEmailStatus('⏱️ 1-min test email scheduled!');
      } else {
        setTestEmailStatus(res.message);
      }
    } catch {
      setTestEmailStatus('Failed to schedule test email');
    } finally {
      setTriggering(false);
    }
  };

  if (isPending) {
    return (
      <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse flex items-center justify-center">
        <span className="w-4 h-4 rounded-full bg-white/20" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <Link
        href="/auth?mode=signin"
        className="btn btn-primary text-xs py-1.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 shadow-md shadow-indigo-500/20"
      >
        <Shield size={14} />
        <span>Sign In</span>
      </Link>
    );
  }

  const userInitial = session.user.name ? session.user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-xs font-semibold"
      >
        <div className="w-7 h-7 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-bold text-xs">
          {userInitial}
        </div>
        <span className="max-w-[100px] truncate text-slate-200">{session.user.name || 'Account'}</span>
        <ChevronDown size={14} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 glass-panel p-2 shadow-2xl z-50 border-indigo-500/30 text-xs bg-[#090d16]/95 backdrop-blur-2xl">
          {/* User Info Header */}
          <div className="p-2.5 mb-1 border-b border-white/10 rounded-lg bg-white/5">
            <p className="font-bold text-slate-200 truncate">{session.user.name || 'User'}</p>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">{session.user.email}</p>
            <div className="mt-2 flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-mono">
              <Database size={10} /> Neon DB Authenticated
            </div>
          </div>

          {/* Links */}
          <div className="space-y-0.5">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            >
              <User size={14} className="text-indigo-400" />
              <span>User Profile & Session</span>
            </Link>

            <Link
              href="/auth"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            >
              <KeyRound size={14} className="text-cyan-400" />
              <span>Auth Portal Studio</span>
            </Link>

            {/* Trigger 1-Minute Test Email Action */}
            <button
              onClick={handleTriggerTestEmail}
              disabled={triggering}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-emerald-500/15 text-emerald-300 hover:text-emerald-200 transition-colors text-left"
            >
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-emerald-400" />
                <span>Test 1-Min Scheduled Email</span>
              </div>
              {triggering && <span className="text-[10px] animate-pulse">Queueing...</span>}
            </button>

            {testEmailStatus && (
              <div className="mx-2 my-1 p-2 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1">
                <Check size={12} className="text-emerald-400 shrink-0" />
                <span>{testEmailStatus}</span>
              </div>
            )}

            <Link
              href={`/unsubscribe?email=${encodeURIComponent(session.user.email)}`}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-rose-500/10 text-slate-300 hover:text-rose-300 transition-colors"
            >
              <BellOff size={14} className="text-rose-400" />
              <span>Unsubscribe Settings</span>
            </Link>
          </div>

          {/* Sign Out Action */}
          <div className="mt-1 pt-1 border-t border-white/10">
            <button
              onClick={() => {
                setIsOpen(false);
                signOut();
              }}
              className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-rose-500/15 text-rose-400 hover:text-rose-300 transition-colors text-left"
            >
              <LogOut size={14} />
              <span>Sign Out Session</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
