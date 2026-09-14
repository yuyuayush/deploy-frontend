'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Rss, Layers, Zap, User, UserPlus, LogIn, Users } from 'lucide-react';
import { UserNavDropdown } from './UserNavDropdown';
import { NotificationCenter } from './NotificationCenter';
import { useSession } from '@/lib/auth-client';

export const Navbar = () => {
  const pathname = usePathname();
  const { data: session, isPending } = useSession();

  const navItems = [
    { label: 'Overview', path: '/', icon: Layers },
    { label: 'Feed', path: '/feed', icon: Rss },
    { label: 'Audience & Subscribe', path: '/audience', icon: Users },
    { label: 'Auth Portal', path: '/auth', icon: ShieldCheck },
    { label: 'Session Profile', path: '/profile', icon: User },
  ];

  const isAuthenticated = Boolean(session?.user);

  return (
    <header className="sticky top-0 z-50 bg-[#07080c]/90 backdrop-blur-xl border-b border-white/10 px-4 py-3 shadow-md shadow-black/40">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-bold text-base tracking-tight text-white hover:opacity-90 transition-opacity">
          <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 border border-white/10">
            <Zap size={18} />
          </div>
          <span className="font-extrabold text-lg bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent tracking-tight">
            Better <span className="text-indigo-400">Auth</span>
          </span>
        </Link>

        {/* Navigation Links - ONLY shown if user is registered / logged in */}
        {isAuthenticated && (
          <nav>
            <ul className="hidden md:flex items-center gap-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-indigo-600/25 text-white border border-indigo-500/40 shadow-sm shadow-indigo-500/20'
                          : 'text-slate-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon size={14} className={isActive ? 'text-indigo-400' : 'text-slate-400'} />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}

        {/* Auth Action Area */}
        <div className="flex items-center gap-2.5">
          {isPending ? (
            <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
          ) : isAuthenticated ? (
            <div className="flex items-center gap-2">
              <NotificationCenter />
              <UserNavDropdown />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth?mode=signin"
                className="btn btn-outline text-xs font-semibold px-4 py-1.5 border-white/20 text-slate-200 hover:text-white hover:bg-white/10 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
              >
                <LogIn size={14} className="text-indigo-400" />
                <span>Login</span>
              </Link>
              <Link
                href="/auth?mode=signup"
                className="btn btn-primary text-xs font-bold px-4.5 py-1.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5 border border-indigo-400/30"
              >
                <UserPlus size={14} />
                <span>Sign Up</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
