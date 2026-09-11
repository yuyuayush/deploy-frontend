'use client';

import React, { useState, useMemo } from 'react';
import { useSession } from '@/lib/auth-client';
import { Rss, Search, Heart, MessageSquare, Share2, Send, RefreshCw, Sparkles, UserCheck } from 'lucide-react';
import Link from 'next/link';

interface FeedPost {
  id: string;
  authorName: string;
  authorRole: 'admin' | 'user' | 'editor';
  authorEmail: string;
  content: string;
  createdAt: string;
  likes: number;
  commentsCount: number;
}

const INITIAL_POSTS: FeedPost[] = [
  {
    id: 'post-1',
    authorName: 'Alex Johnson',
    authorRole: 'admin',
    authorEmail: 'alex.johnson@example.com',
    content: '🚀 Just integrated Three.js interactive 3D graphics on our landing page and connected Better Auth with Neon DB Postgres backend!',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    likes: 35,
    commentsCount: 7,
  },
  {
    id: 'post-2',
    authorName: 'Sarah Connor',
    authorRole: 'user',
    authorEmail: 'sarah.connor@example.com',
    content: 'Loving the clean glassmorphism UI design. The Google OAuth social sign-in via Better Auth is super fast and smooth!',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    likes: 22,
    commentsCount: 4,
  },
  {
    id: 'post-3',
    authorName: 'David Miller',
    authorRole: 'editor',
    authorEmail: 'david.miller@techcorp.io',
    content: 'Tip: Authenticated sessions with Better Auth and Express backend pass secure HTTP-Only cookies directly over CORS.',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    likes: 48,
    commentsCount: 12,
  },
];

export default function FeedPage() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<FeedPost[]>(INITIAL_POSTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [posting, setPosting] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    setPosting(true);
    const newPost: FeedPost = {
      id: `post-${Date.now()}`,
      authorName: session?.user?.name || 'Community Member',
      authorRole: 'user',
      authorEmail: session?.user?.email || 'user@example.com',
      content: newPostContent.trim(),
      createdAt: new Date().toISOString(),
      likes: 0,
      commentsCount: 0,
    };

    setTimeout(() => {
      setPosts([newPost, ...posts]);
      setNewPostContent('');
      setPosting(false);
    }, 300);
  };

  const handleToggleLike = (postId: string) => {
    setLikedPosts((prev) => {
      const isLiked = !prev[postId];
      setPosts((currentPosts) =>
        currentPosts.map((p) =>
          p.id === postId ? { ...p, likes: p.likes + (isLiked ? 1 : -1) } : p
        )
      );
      return { ...prev, [postId]: isLiked };
    });
  };

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts;
    const query = searchQuery.toLowerCase();
    return posts.filter(
      (p) =>
        p.content.toLowerCase().includes(query) ||
        p.authorName.toLowerCase().includes(query)
    );
  }, [posts, searchQuery]);

  return (
    <div className="max-w-3xl mx-auto py-4 space-y-6">
      {/* Feed Header */}
      <section className="flex items-center justify-between flex-wrap gap-4 bg-base-200 p-6 rounded-2xl border border-base-300 shadow-lg">
        <div>
          <div className="badge badge-primary badge-sm gap-1 mb-2">
            <Sparkles size={12} /> Community Stream
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <Rss size={22} className="text-indigo-400" /> Developer Feed
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time developer updates and community posts.
          </p>
        </div>

        {/* Search Input */}
        <div className="form-control w-full sm:w-64">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search feed posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-sm input-bordered pl-9 w-full text-xs"
            />
          </div>
        </div>
      </section>

      {/* Post Publisher Card */}
      <section className="card bg-base-200 border border-indigo-500/30 p-5 shadow-xl">
        <form onSubmit={handleCreatePost} className="space-y-3">
          <div className="flex gap-3">
            <div className="avatar placeholder">
              <div className="bg-indigo-600 text-white rounded-full w-9 font-bold text-xs">
                <span>{session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'U'}</span>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-white flex items-center gap-1.5">
                  {session?.user?.name || 'Community Member'}
                  {session?.user && (
                    <span className="badge badge-success badge-xs gap-1 text-[10px]">
                      <UserCheck size={10} /> Active
                    </span>
                  )}
                </h4>
              </div>

              <textarea
                rows={2}
                placeholder={
                  session?.user
                    ? `What's on your mind, ${session.user.name}? Share an update...`
                    : "Share an update with the community..."
                }
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="textarea textarea-bordered w-full text-xs placeholder-slate-400 resize-none"
              />

              {/* Controls Bar */}
              <div className="flex items-center justify-between pt-2 border-t border-base-300">
                <span className="text-[10px] text-slate-400">Synced to Neon PostgreSQL</span>
                <button
                  type="submit"
                  disabled={posting || !newPostContent.trim()}
                  className="btn btn-primary btn-sm text-xs gap-1.5"
                >
                  {posting ? (
                    <RefreshCw size={14} className="animate-spin" />
                  ) : (
                    <>
                      Publish Post <Send size={12} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </section>

      {/* Feed Posts Stream */}
      <section className="space-y-4">
        {filteredPosts.map((post) => {
          const isLiked = likedPosts[post.id];
          const initial = post.authorName.charAt(0).toUpperCase();

          return (
            <article key={post.id} className="card bg-base-200 border border-base-300 p-5 shadow-lg space-y-3">
              {/* Author Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="avatar placeholder">
                    <div className="bg-neutral text-neutral-content rounded-full w-9 font-bold text-xs">
                      <span>{initial}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-white">{post.authorName}</h4>
                      <span className="badge badge-primary badge-outline text-[10px]">
                        {post.authorRole}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{post.authorEmail}</p>
                  </div>
                </div>
              </div>

              {/* Content Text */}
              <p className="text-xs text-slate-200 leading-relaxed">{post.content}</p>

              {/* Footer Actions */}
              <div className="card-actions justify-between items-center pt-3 border-t border-base-300 text-xs">
                <div className="flex items-center gap-4 text-slate-400">
                  <button
                    onClick={() => handleToggleLike(post.id)}
                    className={`btn btn-ghost btn-xs gap-1.5 ${
                      isLiked ? 'text-rose-400 font-bold' : 'hover:text-white'
                    }`}
                  >
                    <Heart size={14} className={isLiked ? 'fill-rose-400' : ''} />
                    <span>{post.likes}</span>
                  </button>

                  <button className="btn btn-ghost btn-xs gap-1.5 hover:text-white">
                    <MessageSquare size={14} />
                    <span>{post.commentsCount} Comments</span>
                  </button>

                  <button className="btn btn-ghost btn-xs gap-1.5 hover:text-white">
                    <Share2 size={14} />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
