'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Mail, CheckCircle2, ShieldAlert, ArrowLeft, RefreshCw, BellOff } from 'lucide-react';
import Link from 'next/link';
import { unsubscribeUser, checkUnsubscribeStatus } from '@/lib/api';

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get('email') || '';
  const initialStatus = searchParams.get('status');

  const [email, setEmail] = useState(initialEmail);
  const [reason, setReason] = useState('Receiving too many emails');
  const [loading, setLoading] = useState(false);
  const [isUnsubscribed, setIsUnsubscribed] = useState(initialStatus === 'success');
  const [message, setMessage] = useState<string | null>(
    initialStatus === 'success' ? 'You have successfully unsubscribed from email notifications.' : null
  );

  useEffect(() => {
    if (initialEmail) {
      checkUnsubscribeStatus(initialEmail).then((unsubbed) => {
        if (unsubbed) {
          setIsUnsubscribed(true);
          setMessage('You are currently unsubscribed from email notifications.');
        }
      });
    }
  }, [initialEmail]);

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setMessage(null);

    try {
      const res = await unsubscribeUser(email.trim(), reason);
      if (res.success) {
        setIsUnsubscribed(true);
        setMessage('You have successfully unsubscribed from all email notifications.');
      } else {
        setMessage(res.message);
      }
    } catch {
      setMessage('An error occurred while updating your subscription status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 space-y-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={14} /> Back to Dashboard
      </Link>

      <div className="glass-panel p-8 rounded-2xl border border-white/10 shadow-2xl space-y-6 text-center">
        {/* Header Icon */}
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto shadow-lg shadow-rose-500/10">
          <BellOff size={28} />
        </div>

        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">Email Subscriptions</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your email notification preferences for NextEngine Architecture.
          </p>
        </div>

        {/* Status Message */}
        {message && (
          <div
            className={`p-4 rounded-xl text-xs flex items-center gap-2.5 text-left border ${
              isUnsubscribed
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-300 border-rose-500/20'
            }`}
          >
            {isUnsubscribed ? (
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
            ) : (
              <ShieldAlert size={18} className="text-rose-400 shrink-0" />
            )}
            <span>{message}</span>
          </div>
        )}

        {!isUnsubscribed ? (
          <form onSubmit={handleUnsubscribe} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Your Email Address</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-premium pl-9 pr-3 py-2 w-full text-xs outline-none focus:border-rose-500 transition-all text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Reason for Unsubscribing (Optional)</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="input-premium px-3 py-2 w-full text-xs outline-none focus:border-rose-500 transition-all text-slate-200 bg-[#090d16]"
              >
                <option value="Receiving too many emails">Receiving too many emails</option>
                <option value="Content is not relevant to me">Content is not relevant to me</option>
                <option value="Temporary pause">Temporary pause</option>
                <option value="Other">Other reason</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="w-full btn btn-primary py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 border border-rose-500/30 transition-all"
            >
              {loading ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : (
                <>
                  <BellOff size={14} /> Unsubscribe Me
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="pt-2">
            <Link
              href="/"
              className="btn btn-outline text-xs px-6 py-2 border-white/20 text-slate-200 hover:text-white rounded-xl inline-block"
            >
              Return to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading...</div>}>
      <UnsubscribeContent />
    </Suspense>
  );
}
