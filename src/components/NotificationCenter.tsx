'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from '@/lib/auth-client';
import {
  Bell,
  Heart,
  MessageSquare,
  CheckCheck,
  Sparkles,
  Inbox,
  Link as LinkIcon,
} from 'lucide-react';
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  NotificationItem,
} from '@/lib/api';

function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSec < 10) return 'Just now';
    if (diffSec < 60) return `${diffSec}s ago`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDay = Math.floor(diffHr / 24);
    return `${diffDay}d ago`;
  } catch {
    return 'Recently';
  }
}

export const NotificationCenter: React.FC = () => {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const userEmail = session?.user?.email;

  const loadNotifications = useCallback(async () => {
    if (!userEmail) return;
    try {
      const notifs = await fetchNotifications(userEmail);
      setNotifications(notifs);
    } catch {
      // Ignore polling errors
    }
  }, [userEmail]);

  useEffect(() => {
    if (!userEmail) return;

    loadNotifications();

    // Poll for new notifications every 8 seconds
    const interval = setInterval(() => {
      loadNotifications();
    }, 8000);

    return () => clearInterval(interval);
  }, [userEmail, loadNotifications]);

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

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkOne = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    await markNotificationAsRead(id);
  };

  const handleMarkAll = async () => {
    if (!userEmail) return;
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    await markAllNotificationsAsRead(userEmail);
  };

  if (!session?.user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) loadNotifications();
        }}
        className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all shadow-sm"
        title="Notifications"
        aria-label="Notifications"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white font-extrabold text-[10px] rounded-full flex items-center justify-center shadow-lg shadow-rose-500/50 animate-pulse border border-white/20">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-panel p-3 shadow-2xl z-50 border-indigo-500/30 text-xs bg-[#090d16]/95 backdrop-blur-2xl rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-2.5 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                <Sparkles size={12} />
              </div>
              <h3 className="font-bold text-slate-100 text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <span className="bg-rose-500/20 text-rose-300 font-semibold px-2 py-0.5 rounded-full text-[10px] border border-rose-500/30">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAll}
                className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold transition-colors hover:underline"
              >
                <CheckCheck size={13} />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* List of Notifications */}
          <div className="mt-2 space-y-1.5 max-h-80 overflow-y-auto pr-0.5 custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-8 text-center space-y-2 text-slate-400">
                <div className="w-10 h-10 rounded-full bg-white/5 text-slate-500 flex items-center justify-center mx-auto border border-white/10">
                  <Inbox size={20} />
                </div>
                <p className="font-semibold text-slate-300">No notifications yet</p>
                <p className="text-[11px] text-slate-500 max-w-[200px] mx-auto">
                  When developers like or interact with your posts, updates will appear here.
                </p>
              </div>
            ) : (
              notifications.map((notif) => {
                const isUnread = !notif.read;
                return (
                  <div
                    key={notif.id}
                    onClick={() => handleMarkOne(notif.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex gap-3 items-start ${
                      isUnread
                        ? 'bg-indigo-500/10 border-indigo-500/30 text-white'
                        : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {/* Icon Type */}
                    <div className="mt-0.5 shrink-0">
                      {notif.type === 'like' ? (
                        <div className="w-7 h-7 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
                          <Heart size={14} className="fill-rose-400/80 text-rose-400" />
                        </div>
                      ) : notif.type === 'comment' ? (
                        <div className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
                          <MessageSquare size={14} />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
                          <LinkIcon size={14} />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-200 text-xs truncate">
                          {notif.senderName}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {formatRelativeTime(notif.createdAt)}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2 leading-tight">
                        {notif.message}
                      </p>
                    </div>

                    {/* Unread indicator dot */}
                    {isUnread && (
                      <div className="w-2 h-2 rounded-full bg-indigo-400 shrink-0 mt-2 shadow-sm shadow-indigo-400/80" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
