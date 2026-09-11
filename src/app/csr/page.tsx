'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { User, CreateUserInput } from '@/types';
import { createUser } from '@/lib/api';
import { RenderingBadge } from '@/components/RenderingBadge';
import { UserCard } from '@/components/UserCard';
import { CodeBlock } from '@/components/CodeBlock';
import { Monitor, Search, Filter, Plus, UserPlus, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export default function CSRPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user' | 'editor'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<CreateUserInput>({
    name: '',
    email: '',
    role: 'user',
  });

  const fetchClientUsers = async () => {
    setLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
    try {
      const res = await fetch(`${apiUrl}/users`, {
        credentials: 'include',
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        const json = await res.json();
        setUsers(json.data || []);
      } else {
        throw new Error('API offline');
      }
    } catch {
      // Client fallback mock
      setUsers([
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Alex Johnson',
          email: 'alex.johnson@example.com',
          role: 'admin',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '987e6543-e21b-12d3-a456-426614174000',
          name: 'Sarah Connor',
          email: 'sarah.connor@example.com',
          role: 'user',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          name: 'David Miller',
          email: 'david.miller@techcorp.io',
          role: 'editor',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientUsers();
  }, []);

  // Filtered users computed in browser memory
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  const handleAddUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setFormError('Name and Email are required.');
      return;
    }

    setSubmitting(true);
    setFormError(null);
    setFormSuccess(null);

    try {
      const newUser = await createUser(formData);
      setUsers((prev) => [newUser, ...prev]);
      setFormSuccess(`User ${newUser.name} created successfully!`);
      setFormData({ name: '', email: '', role: 'user' });
      setShowAddModal(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      setSubmitting(false);
    }
  };

  const codeExample = `// src/app/csr/page.tsx
'use client';

import { useState, useEffect } from 'react';

export default function CSRPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Client-side execution in user browser
    fetch('/api/v1/users')
      .then(res => res.json())
      .then(data => setUsers(data.data));
  }, []);

  return <InteractiveView users={users} />;
}`;

  return (
    <div>
      {/* Header */}
      <section className="page-header">
        <div className="header-top">
          <RenderingBadge strategy="CSR" />
          <span className="text-xs text-slate-400 font-mono">React Client State Execution</span>
        </div>
        <h1 className="page-title flex items-center gap-3">
          <Monitor className="text-purple-500" size={32} />
          Client-Side Rendering (CSR)
        </h1>
        <p className="page-description">
          Executed directly in the browser runtime using React Client Components (<code>&apos;use client&apos;</code>). Features instant live search, role filter controls, state mutations, and user creation.
        </p>
      </section>

      {/* Control Panel Bar */}
      <section className="glass-panel p-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Search Box */}
          <div className="flex items-center gap-2 flex-1 min-w-[240px]">
            <div className="relative w-full">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input pl-9 w-full text-xs"
              />
            </div>
          </div>

          {/* Role Filter Tabs */}
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-md text-xs">
            <span className="px-2 text-slate-400 font-medium flex items-center gap-1">
              <Filter size={12} /> Role:
            </span>
            {(['all', 'admin', 'user', 'editor'] as const).map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-3 py-1 rounded font-semibold capitalize transition-colors ${
                  roleFilter === role ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button onClick={fetchClientUsers} className="btn btn-secondary text-xs py-2">
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              Refetch
            </button>
            <button onClick={() => setShowAddModal(true)} className="btn btn-primary text-xs bg-purple-600 hover:bg-purple-500 py-2">
              <UserPlus size={14} /> Add User
            </button>
          </div>
        </div>
      </section>

      {/* Messages */}
      {formSuccess && (
        <div className="mb-4 p-3 rounded text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-2">
          <CheckCircle2 size={16} /> {formSuccess}
        </div>
      )}

      {/* User Grid */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span>Client State Records</span>
            <span className="text-xs font-normal text-slate-400">({filteredUsers.length} shown of {users.length})</span>
          </h2>
        </div>

        {loading ? (
          <div className="glass-panel p-12 text-center text-slate-400 text-sm">
            <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-purple-400" />
            Loading client data dynamically...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="glass-panel p-12 text-center text-slate-400 text-sm">
            No matching users found for criteria &quot;{searchQuery}&quot;.
          </div>
        ) : (
          <div className="user-grid">
            {filteredUsers.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        )}
      </section>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-panel p-6 w-full max-w-md border-purple-500/30">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <UserPlus size={18} className="text-purple-400" /> Create Client User
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white text-lg">
                &times;
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-2.5 rounded text-xs bg-rose-500/10 text-rose-300 border border-rose-500/20 flex items-center gap-2">
                <AlertCircle size={14} /> {formError}
              </div>
            )}

            <form onSubmit={handleAddUserSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. john.doe@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'user' | 'editor' })}
                  className="form-select"
                >
                  <option value="user">User</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 mt-6 pt-3 border-t border-white/10">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary text-xs">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary text-xs bg-purple-600 hover:bg-purple-500">
                  {submitting ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Code Snippet Explanation */}
      <section className="glass-panel p-6">
        <h3 className="text-lg font-bold mb-2">How CSR Works in Next.js App Router</h3>
        <p className="text-sm text-slate-300 mb-4">
          Client Components marked with <code>&apos;use client&apos;</code> allow full access to browser APIs, local state (<code>useState</code>), reactivity, and client-side network calls.
        </p>

        <CodeBlock code={codeExample} filename="src/app/csr/page.tsx" />
      </section>
    </div>
  );
}
