import React from 'react';
import { RenderingStrategy } from '@/types';

interface RenderingBadgeProps {
  strategy: RenderingStrategy;
  revalidateTime?: number;
  interactive?: boolean;
}

export const RenderingBadge: React.FC<RenderingBadgeProps> = ({ strategy, revalidateTime, interactive = false }) => {
  const getBadgeDetails = () => {
    switch (strategy) {
      case 'SSR':
        return {
          label: 'SSR • Server-Side Rendered',
          className: 'badge-ssr',
          tooltip: 'Dynamic HTML rendered on server for every incoming HTTP request.',
        };
      case 'SSG':
        return {
          label: 'SSG • Static Site Generated',
          className: 'badge-ssg',
          tooltip: 'HTML generated once at build time. Serves instantly from edge CDNs.',
        };
      case 'ISR':
        return {
          label: `ISR • Incremental Static (${revalidateTime || 10}s)`,
          className: 'badge-isr',
          tooltip: 'Stale-while-revalidate caching. Automatically rebuilds background cache every N seconds or on-demand.',
        };
      case 'CSR':
        return {
          label: 'CSR • Client-Side Rendered',
          className: 'badge-csr',
          tooltip: 'Rendered in user browser via React state & useEffect hooks.',
        };
    }
  };

  const details = getBadgeDetails();

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${details.className} ${
        interactive ? 'cursor-pointer hover:scale-105 transition-transform' : ''
      }`}
      title={details.tooltip}
    >
      <span className="w-2 h-2 rounded-full bg-current opacity-80" />
      {details.label}
    </span>
  );
};
