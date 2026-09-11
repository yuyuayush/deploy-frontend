import React from 'react';
import { Zap, Heart } from 'lucide-react';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Zap size={14} className="text-indigo-400" />
          <span>DevStream Community Platform</span>
        </div>

        <div className="flex items-center gap-6 text-slate-400">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <Link href="/feed" className="hover:text-white transition-colors">Feed</Link>
          <Link href="/auth" className="hover:text-white transition-colors">Auth</Link>
        </div>
      </div>
    </footer>
  );
};
