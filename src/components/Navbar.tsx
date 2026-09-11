'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Rss, Layers, Zap, User } from 'lucide-react';
import { UserNavDropdown } from './UserNavDropdown';

export const Navbar = () => {
  const pathname = usePathname();

  const navItems = [
    { label: 'Overview', path: '/', icon: Layers },
    { label: 'Feed', path: '/feed', icon: Rss },
    { label: 'Auth Portal', path: '/auth', icon: ShieldCheck },
    { label: 'Session Profile', path: '/profile', icon: User },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#07080c]/80 backdrop-blur-xl border-b border-white/10 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-base tracking-tight text-white hover:opacity-90 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-purple-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
            <Zap size={18} />
          </div>
          <span className="font-extrabold text-lg bg-gradient-to-r from-white via-slate-100 to-indigo-200 -webkit-background-clip-text text-transparent">
            Better Auth
          </span>
        </Link>

        <nav>
          <ul className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon size={14} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <UserNavDropdown />
        </div>
      </div>
    </header>
  );
};
