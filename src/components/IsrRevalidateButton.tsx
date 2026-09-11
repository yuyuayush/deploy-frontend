'use client';

import React, { useState, useTransition } from 'react';
import { triggerIsrRevalidation } from '@/lib/actions';
import { RefreshCw, Zap, CheckCircle2, AlertCircle } from 'lucide-react';

export const IsrRevalidateButton: React.FC = () => {
  const [isPending, startTransition] = useTransition();
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleRevalidate = () => {
    setStatusMessage(null);
    startTransition(async () => {
      const res = await triggerIsrRevalidation();
      if (res.success) {
        setStatusMessage({
          text: `On-Demand ISR Revalidation Triggered! Cache primed at ${new Date(res.timestamp).toLocaleTimeString()}`,
          type: 'success',
        });
      } else {
        setStatusMessage({
          text: res.message,
          type: 'error',
        });
      }
    });
  };

  return (
    <div className="glass-panel p-4 border-blue-500/30">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h4 className="font-bold text-sm text-blue-300 flex items-center gap-1.5">
            <Zap size={16} /> On-Demand Cache Revalidation
          </h4>
          <p className="text-xs text-slate-300 mt-0.5">
            Triggers <code>revalidatePath(&apos;/isr&apos;)</code> via Next.js Server Action without waiting for 10s timer.
          </p>
        </div>

        <button
          onClick={handleRevalidate}
          disabled={isPending}
          className="btn btn-primary text-xs bg-blue-600 hover:bg-blue-500 shadow-blue-500/20"
        >
          <RefreshCw size={14} className={isPending ? 'animate-spin' : ''} />
          {isPending ? 'Revalidating Cache...' : 'Trigger On-Demand Revalidation'}
        </button>
      </div>

      {statusMessage && (
        <div
          className={`mt-3 p-2.5 rounded text-xs flex items-center gap-2 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
          }`}
        >
          {statusMessage.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
          <span>{statusMessage.text}</span>
        </div>
      )}
    </div>
  );
};
