'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSession } from '@/lib/auth-client';
import { Rss, Search, Heart, MessageSquare, Share2, Send, RefreshCw, Sparkles, UserCheck, AlertCircle, MessageSquarePlus } from 'lucide-react';
import { fetchFeedPosts, publishPost, togglePostLike, FeedPost } from '@/lib/api';

export default function FeedPage() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [posting, setPosting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  // Load real posts exclusively from Express API & Neon PostgreSQL
  const loadPosts = async () => {
    setLoadingPosts(true);
    try {
      const apiPosts = await fetchFeedPosts();
      setPosts(apiPosts || []);
    } catch {
      setPosts([]);
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    setPosting(true);
    setErrorMsg(null);

    const postData = {
      authorName: session?.user?.name || 'Community Member',
      authorRole: 'user',
      authorEmail: session?.user?.email || 'user@example.com',
      content: newPostContent.trim(),
    };

    try {
      const created = await publishPost(postData);
      setPosts([created, ...posts]);
      setNewPostContent('');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to publish post to backend');
    } finally {
      setPosting(false);
    }
  };

  const handleToggleLike = async (postId: string) => {
    const isCurrentlyLiked = Boolean(likedPosts[postId]);
    const willLike = !isCurrentlyLiked;

    // Optimistic UI update
    setLikedPosts((prev) => ({ ...prev, [postId]: willLike }));
    setPosts((currentPosts) =>
      currentPosts.map((p) =>
        p.id === postId ? { ...p, likes: Math.max(0, p.likes + (willLike ? 1 : -1)) } : p
      )
    );

    try {
      await togglePostLike(postId, willLike);
    } catch {
      // Keep optimistic UI state
    }
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
      <section className="flex items-center justify-between flex-wrap gap-4 glass-panel p-6 rounded-2xl border border-white/10 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-2">
            <Sparkles size={12} /> Community Stream
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <Rss size={22} className="text-indigo-400" /> Developer Feed
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time developer updates persisted in Neon PostgreSQL.
          </p>
        </div>

        {/* Search Input */}
        <div className="w-full sm:w-64">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search feed posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-premium pl-9 pr-3 py-2 w-full text-xs outline-none focus:border-indigo-500 transition-all"
            />
          </div>
        </div>
      </section>

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-3 rounded-xl text-xs bg-rose-500/10 text-rose-300 border border-rose-500/20 flex items-center gap-2">
          <AlertCircle size={16} className="text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Post Publisher Card */}
      <section className="glass-panel border border-indigo-500/30 p-5 rounded-2xl shadow-xl">
        <form onSubmit={handleCreatePost} className="space-y-3">
          <div className="flex gap-3">
            <div className="w-9 h-9 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
              <span>{session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'U'}</span>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-white flex items-center gap-1.5">
                  {session?.user?.name || 'Community Member'}
                  {session?.user && (
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                      <UserCheck size={10} /> Active Session
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
                className="input-premium p-3 w-full text-xs text-white placeholder:text-slate-400 resize-none outline-none focus:border-indigo-500 transition-all"
              />

              {/* Controls Bar */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <span className="text-[10px] text-slate-400 font-mono">Synced to Neon PostgreSQL DB</span>
                <button
                  type="submit"
                  disabled={posting || !newPostContent.trim()}
                  className="btn btn-primary text-xs py-1.5 px-4 rounded-xl gap-1.5"
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
        {loadingPosts ? (
          <div className="glass-panel p-8 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
            <RefreshCw size={16} className="animate-spin text-indigo-400" />
            Loading posts from Neon PostgreSQL...
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="glass-panel p-10 text-center space-y-3 border-dashed border-white/15">
            <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/20">
              <MessageSquarePlus size={24} />
            </div>
            <h3 className="text-base font-bold text-white">No Posts Yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {searchQuery ? `No posts matched "${searchQuery}".` : 'Be the first to publish a post and share an update with the community!'}
            </p>
          </div>
        ) : (
          filteredPosts.map((post) => {
            const isLiked = likedPosts[post.id];
            const initial = post.authorName ? post.authorName.charAt(0).toUpperCase() : 'U';

            return (
              <article key={post.id} className="glass-panel p-5 rounded-2xl shadow-lg space-y-3">
                {/* Author Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-white/10 text-white rounded-full flex items-center justify-center font-bold text-xs border border-white/10">
                      <span>{initial}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-white">{post.authorName}</h4>
                        <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize">
                          {post.authorRole || 'user'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{post.authorEmail}</p>
                    </div>
                  </div>
                </div>

                {/* Content Text */}
                <p className="text-xs text-slate-200 leading-relaxed">{post.content}</p>

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                  <div className="flex items-center gap-4 text-slate-400 font-medium">
                    <button
                      onClick={() => handleToggleLike(post.id)}
                      className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg hover:bg-white/5 transition-colors ${
                        isLiked ? 'text-rose-400 font-bold' : 'hover:text-white'
                      }`}
                    >
                      <Heart size={14} className={isLiked ? 'fill-rose-400 text-rose-400' : ''} />
                      <span>{post.likes}</span>
                    </button>

                    <button className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg hover:bg-white/5 hover:text-white transition-colors">
                      <MessageSquare size={14} />
                      <span>{post.commentsCount} Comments</span>
                    </button>

                    <button className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg hover:bg-white/5 hover:text-white transition-colors">
                      <Share2 size={14} />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </section>
    </div>
  );
}
