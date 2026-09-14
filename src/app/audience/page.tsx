'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import { subscribeToAudience, submitContactInquiry, getAudienceStatus } from '@/lib/api';
import { RenderingBadge } from '@/components/RenderingBadge';
import {
  Users,
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  MessageSquare,
  ShieldCheck,
  Zap,
  Bell,
  RefreshCw,
} from 'lucide-react';

export default function AudiencePage() {
  const { data: session } = useSession();
  const user = session?.user;

  // Subscription state
  const [subName, setSubName] = useState('');
  const [subEmail, setSubEmail] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
  const [subLoading, setSubLoading] = useState(false);
  const [subSuccess, setSubSuccess] = useState<string | null>(null);
  const [subError, setSubError] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [audienceCount, setAudienceCount] = useState<number>(42);

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState<string | null>(null);
  const [contactError, setContactError] = useState<string | null>(null);

  // Auto-fill logged-in user credentials
  useEffect(() => {
    if (user?.email) {
      setSubEmail(user.email);
      setContactEmail(user.email);
    }
    if (user?.name) {
      setSubName(user.name);
      setContactName(user.name);
    }
  }, [user]);

  // Fetch initial audience count and status
  useEffect(() => {
    async function loadStatus() {
      const status = await getAudienceStatus(user?.email);
      setAudienceCount(status.count);
      setIsSubscribed(status.isSubscribed);
    }
    loadStatus();
  }, [user?.email]);

  // Handle newsletter subscription
  const handleSubscribeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subEmail) {
      setSubError('Email address is required.');
      return;
    }

    setSubLoading(true);
    setSubError(null);
    setSubSuccess(null);

    const res = await subscribeToAudience({
      email: subEmail,
      name: subName || 'Subscriber',
      frequency,
    });

    setSubLoading(false);
    if (res.success) {
      setSubSuccess(res.message);
      setIsSubscribed(true);
      setAudienceCount((prev) => prev + 1);
    } else {
      setSubError(res.message);
    }
  };

  // Handle contact inquiry form submission
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !subject || !message) {
      setContactError('Please fill in all fields (Name, Email, Subject, and Message).');
      return;
    }

    setContactLoading(true);
    setContactError(null);
    setContactSuccess(null);

    const res = await submitContactInquiry({
      name: contactName,
      email: contactEmail,
      subject,
      message,
    });

    setContactLoading(false);
    if (res.success) {
      setContactSuccess(res.message);
      setSubject('');
      setMessage('');
    } else {
      setContactError(res.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Page Header */}
      <section className="page-header mb-8 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900/40 p-8 rounded-3xl border border-indigo-500/20 shadow-2xl backdrop-blur-xl">
        <div className="max-w-2xl">
          <div className="header-top flex items-center gap-2 mb-3 justify-center md:justify-start">
            <RenderingBadge strategy="CSR" />
            <span className="text-xs font-mono text-indigo-300 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
              Community Audience Hub
            </span>
          </div>
          <h1 className="page-title text-3xl md:text-4xl font-extrabold flex items-center justify-center md:justify-start gap-3 bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
            <Users className="text-indigo-400" size={36} />
            Audience & Daily Updates
          </h1>
          <p className="page-description text-sm text-slate-300 mt-2 leading-relaxed">
            Join our developer audience to receive daily email digests of trending post discussions, release notes, and community updates dispatched automatically via BullMQ & Resend.
          </p>
        </div>

        {/* Live Audience Metrics Card */}
        <div className="glass-panel p-5 min-w-[220px] text-center border-indigo-500/30 bg-indigo-600/10 rounded-2xl">
          <div className="flex items-center justify-center gap-2 text-indigo-400 text-xs font-semibold mb-1">
            <Sparkles size={16} /> Live Audience
          </div>
          <div className="text-3xl font-black text-white tracking-tight font-mono">
            {audienceCount.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Active Email Subscribers</p>
          {isSubscribed && (
            <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <CheckCircle2 size={12} /> You are Subscribed
            </div>
          )}
        </div>
      </section>

      {/* Grid Layout: Newsletter Subscription & Contact Us */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Left Column: Daily Email Newsletter Subscription (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel p-6 md:p-8 rounded-3xl border border-purple-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
              <div className="p-2.5 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <Mail size={22} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Subscribe to Daily Updates</h2>
                <p className="text-xs text-slate-400">Select your preferred frequency to receive curated email notifications.</p>
              </div>
            </div>

            {subSuccess && (
              <div className="mb-6 p-4 rounded-xl text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-3">
                <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
                <div>
                  <div className="font-bold">Subscription Confirmed!</div>
                  <div>{subSuccess}</div>
                </div>
              </div>
            )}

            {subError && (
              <div className="mb-6 p-4 rounded-xl text-xs bg-rose-500/10 text-rose-300 border border-rose-500/30 flex items-center gap-3">
                <AlertCircle size={20} className="text-rose-400 shrink-0" />
                <div>
                  <div className="font-bold">Subscription Error</div>
                  <div>{subError}</div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubscribeSubmit} className="space-y-4">
              <div>
                <label className="form-label text-xs font-semibold text-slate-300 mb-1 block">Full Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Alex Rivera"
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  className="form-input w-full text-xs py-2.5 px-3 rounded-xl bg-slate-950/60 border border-white/10 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="form-label text-xs font-semibold text-slate-300 mb-1 block">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. alex.rivera@example.com"
                  value={subEmail}
                  onChange={(e) => setSubEmail(e.target.value)}
                  className="form-input w-full text-xs py-2.5 px-3 rounded-xl bg-slate-950/60 border border-white/10 focus:border-purple-500"
                />
              </div>

              {/* Frequency Selection Radio Cards */}
              <div>
                <label className="form-label text-xs font-semibold text-slate-300 mb-2 block flex items-center gap-1.5">
                  <Clock size={14} className="text-purple-400" /> Email Frequency Preference
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFrequency('daily')}
                    className={`p-3 rounded-xl text-left border transition-all flex flex-col justify-between ${
                      frequency === 'daily'
                        ? 'bg-purple-600/25 border-purple-500 text-white shadow-lg shadow-purple-500/10'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold mb-1">
                      <span className="flex items-center gap-1.5">
                        <Zap size={14} className="text-amber-400" /> Daily Digest
                      </span>
                      {frequency === 'daily' && <CheckCircle2 size={14} className="text-purple-400" />}
                    </div>
                    <span className="text-[11px] text-slate-400 leading-tight">
                      Instant daily summary sent every morning at 8:00 AM.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFrequency('weekly')}
                    className={`p-3 rounded-xl text-left border transition-all flex flex-col justify-between ${
                      frequency === 'weekly'
                        ? 'bg-purple-600/25 border-purple-500 text-white shadow-lg shadow-purple-500/10'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold mb-1">
                      <span className="flex items-center gap-1.5">
                        <Bell size={14} className="text-indigo-400" /> Weekly Digest
                      </span>
                      {frequency === 'weekly' && <CheckCircle2 size={14} className="text-purple-400" />}
                    </div>
                    <span className="text-[11px] text-slate-400 leading-tight">
                      Curated weekly recap delivered every Monday morning.
                    </span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={subLoading}
                className="btn btn-primary w-full py-3 text-xs font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white rounded-xl shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 border border-purple-400/30 mt-4"
              >
                {subLoading ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" /> Subscribing...
                  </>
                ) : (
                  <>
                    <Send size={16} /> Subscribe to {frequency === 'daily' ? 'Daily Updates' : 'Weekly Digest'}
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Audience Benefits Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-panel p-4 rounded-2xl border border-white/10 text-center">
              <ShieldCheck className="mx-auto text-emerald-400 mb-2" size={24} />
              <h3 className="text-xs font-bold text-white mb-1">Zero Spam</h3>
              <p className="text-[11px] text-slate-400">Strict privacy & 1-click unsubscription links in every email.</p>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-white/10 text-center">
              <Zap className="mx-auto text-amber-400 mb-2" size={24} />
              <h3 className="text-xs font-bold text-white mb-1">BullMQ Queue</h3>
              <p className="text-[11px] text-slate-400">High-speed background queue dispatching via Resend API.</p>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-white/10 text-center">
              <Users className="mx-auto text-indigo-400 mb-2" size={24} />
              <h3 className="text-xs font-bold text-white mb-1">Neon Sync</h3>
              <p className="text-[11px] text-slate-400">Subscriber state synchronized directly to Neon PostgreSQL.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Audience Contact & Inquiry Form (5 cols) */}
        <div className="lg:col-span-5">
          <div className="glass-panel p-6 md:p-8 rounded-3xl border border-indigo-500/20 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
                <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  <MessageSquare size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Contact & Inquiry</h2>
                  <p className="text-xs text-slate-400">Send feedback, questions, or audience inquiries.</p>
                </div>
              </div>

              {contactSuccess && (
                <div className="mb-4 p-3 rounded-xl text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  <span>{contactSuccess}</span>
                </div>
              )}

              {contactError && (
                <div className="mb-4 p-3 rounded-xl text-xs bg-rose-500/10 text-rose-300 border border-rose-500/30 flex items-center gap-2">
                  <AlertCircle size={16} className="text-rose-400 shrink-0" />
                  <span>{contactError}</span>
                </div>
              )}

              <form onSubmit={handleContactSubmit} className="space-y-3.5">
                <div>
                  <label className="form-label text-xs font-semibold text-slate-300 mb-1 block">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Connor"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="form-input w-full text-xs py-2 px-3 rounded-xl bg-slate-950/60 border border-white/10 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="form-label text-xs font-semibold text-slate-300 mb-1 block">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. sarah@example.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="form-input w-full text-xs py-2 px-3 rounded-xl bg-slate-950/60 border border-white/10 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="form-label text-xs font-semibold text-slate-300 mb-1 block">Subject *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Daily Update Feedback / Partnership"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="form-input w-full text-xs py-2 px-3 rounded-xl bg-slate-950/60 border border-white/10 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="form-label text-xs font-semibold text-slate-300 mb-1 block">Message *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Type your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="form-input w-full text-xs py-2 px-3 rounded-xl bg-slate-950/60 border border-white/10 focus:border-indigo-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={contactLoading}
                  className="btn btn-secondary w-full py-2.5 text-xs font-bold text-white bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {contactLoading ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" /> Sending Message...
                    </>
                  ) : (
                    <>
                      <Send size={14} /> Send Inquiry Message
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 text-center text-[11px] text-slate-400">
              Messages are saved securely to our Postgres database for audience management.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
