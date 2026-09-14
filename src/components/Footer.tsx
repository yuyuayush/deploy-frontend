import React from 'react';
import { Zap } from 'lucide-react';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="footer bg-[#07080c] border-t border-white/10 py-6 mt-12">
      <div className="footer-inner text-xs max-w-6xl mx-auto flex items-center justify-between px-4">
        <div className="flex items-center gap-2 text-slate-300 font-medium">
          <Zap size={14} className="text-indigo-400" />
          <span>DevStream Community Platform</span>
        </div>

        <div className="flex items-center gap-6 text-slate-400 font-medium">
          <Link href="/" className="hover:text-white transition-colors">Overview</Link>
          <Link href="/feed" className="hover:text-white transition-colors">Feed</Link>
          <Link href="/audience" className="hover:text-white transition-colors">Audience & Subscribe</Link>
          <Link href="/auth" className="hover:text-white transition-colors">Auth Portal</Link>
        </div>
      </div>
    </footer>
  );
};
