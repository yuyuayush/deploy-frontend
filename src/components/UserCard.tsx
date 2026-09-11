import React from 'react';
import Link from 'next/link';
import { User } from '@/types';
import { Mail, Calendar, ArrowRight, Shield } from 'lucide-react';

interface UserCardProps {
  user: User;
  showDetailsLink?: boolean;
}

export const UserCard: React.FC<UserCardProps> = ({ user, showDetailsLink = true }) => {
  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'admin':
        return 'role-admin';
      case 'editor':
        return 'role-editor';
      default:
        return 'role-user';
    }
  };

  const formattedDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="glass-panel user-card">
      <div className="user-header">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-300 text-sm">
            {user.name.charAt(0)}
          </div>
          <div>
            <h3 className="user-name">{user.name}</h3>
            <p className="user-email flex items-center gap-1">
              <Mail size={12} /> {user.email}
            </p>
          </div>
        </div>
        <span className={`role-badge ${getRoleBadgeClass(user.role)} flex items-center gap-1`}>
          <Shield size={10} /> {user.role}
        </span>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <Calendar size={12} /> Registered: {formattedDate}
        </span>

        {showDetailsLink && (
          <Link
            href={`/ssg/${user.id}`}
            className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
          >
            Static View <ArrowRight size={12} />
          </Link>
        )}
      </div>
    </div>
  );
};
