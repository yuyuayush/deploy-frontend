import { User, CreateUserInput, ApiSuccessResponse } from '@/types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_API_URL ||
  'http://localhost:8080/api/v1';

// Initial Mock Dataset for fallback & zero-config testing
const MOCK_USERS: User[] = [
  {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    role: 'admin',
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: '987e6543-e21b-12d3-a456-426614174000',
    name: 'Sarah Connor',
    email: 'sarah.connor@example.com',
    role: 'user',
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'David Miller',
    email: 'david.miller@techcorp.io',
    role: 'editor',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
    name: 'Elena Rostova',
    email: 'elena.rostova@cloudscale.net',
    role: 'admin',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Helper to simulate dynamic server response timestamps
export function getFetchMetadata(source: 'express-api' | 'mock-fallback', strategy: 'SSR' | 'SSG' | 'ISR' | 'CSR') {
  return {
    timestamp: new Date().toISOString(),
    formattedTime: new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }),
    source,
    strategy,
  };
}

/**
 * Check backend connection status
 */
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, {
      cache: 'no-store',
      credentials: 'include',
    });
    if (!res.ok) return { healthy: false, error: `HTTP ${res.status}` };
    const data = await res.json();
    return { healthy: true, data };
  } catch (error) {
    return { healthy: false, error: error instanceof Error ? error.message : 'Backend offline' };
  }
}

/**
 * SSR Fetch - No Store / Cache disabled. Always fetches fresh data from Express Backend.
 */
export async function getUsersSSR(): Promise<{ users: User[]; meta: ReturnType<typeof getFetchMetadata>; latencyMs: number }> {
  const startTime = performance.now();
  try {
    const res = await fetch(`${API_BASE_URL}/users`, {
      cache: 'no-store',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json: ApiSuccessResponse<User[]> = await res.json();
    const endTime = performance.now();

    return {
      users: json.data,
      meta: getFetchMetadata('express-api', 'SSR'),
      latencyMs: Math.round(endTime - startTime),
    };
  } catch {
    const endTime = performance.now();
    return {
      users: MOCK_USERS,
      meta: getFetchMetadata('mock-fallback', 'SSR'),
      latencyMs: Math.round(endTime - startTime),
    };
  }
}

/**
 * SSG Fetch - Cache Force Static. Pre-rendered once during build time or cached permanently.
 */
export async function getUsersSSG(): Promise<{ users: User[]; meta: ReturnType<typeof getFetchMetadata>; latencyMs: number }> {
  const startTime = performance.now();
  try {
    const res = await fetch(`${API_BASE_URL}/users`, {
      cache: 'force-cache',
      credentials: 'include',
    });

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json: ApiSuccessResponse<User[]> = await res.json();
    const endTime = performance.now();

    return {
      users: json.data,
      meta: getFetchMetadata('express-api', 'SSG'),
      latencyMs: Math.round(endTime - startTime),
    };
  } catch {
    const endTime = performance.now();
    return {
      users: MOCK_USERS,
      meta: getFetchMetadata('mock-fallback', 'SSG'),
      latencyMs: Math.round(endTime - startTime),
    };
  }
}

/**
 * ISR Fetch - Revalidate every N seconds with cache tags for On-Demand Revalidation.
 */
export async function getUsersISR(revalidateSeconds = 10): Promise<{ users: User[]; meta: ReturnType<typeof getFetchMetadata>; latencyMs: number }> {
  const startTime = performance.now();
  try {
    const res = await fetch(`${API_BASE_URL}/users`, {
      credentials: 'include',
      next: {
        revalidate: revalidateSeconds,
        tags: ['users'],
      },
    });

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json: ApiSuccessResponse<User[]> = await res.json();
    const endTime = performance.now();

    return {
      users: json.data,
      meta: getFetchMetadata('express-api', 'ISR'),
      latencyMs: Math.round(endTime - startTime),
    };
  } catch {
    const endTime = performance.now();
    return {
      users: MOCK_USERS,
      meta: getFetchMetadata('mock-fallback', 'ISR'),
      latencyMs: Math.round(endTime - startTime),
    };
  }
}

/**
 * Get single user by ID for static route rendering (`/ssg/[id]`)
 */
export async function getUserById(id: string): Promise<User | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
      credentials: 'include',
      next: { revalidate: 30, tags: [`user-${id}`] },
    });
    if (!res.ok) throw new Error('Failed to fetch user');
    const json: ApiSuccessResponse<User> = await res.json();
    return json.data;
  } catch {
    return MOCK_USERS.find((u) => u.id === id) || MOCK_USERS[0];
  }
}

/**
 * Create a new user (used in CSR & Server Actions)
 */
export async function createUser(input: CreateUserInput): Promise<User> {
  try {
    const res = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to create user');
    }
    const json: ApiSuccessResponse<User> = await res.json();
    return json.data;
  } catch (error) {
    const fallbackUser: User = {
      id: crypto.randomUUID(),
      name: input.name,
      email: input.email,
      role: input.role || 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    MOCK_USERS.unshift(fallbackUser);
    return fallbackUser;
  }
}

// -------------------------------------------------------------
// POSTS & COMMUNITY FEED API
// -------------------------------------------------------------

export interface FeedPost {
  id: string;
  authorName: string;
  authorRole: 'admin' | 'user' | 'editor';
  authorEmail: string;
  content: string;
  createdAt: string;
  likes: number;
  commentsCount: number;
}

export async function fetchFeedPosts(): Promise<FeedPost[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/posts`, {
      cache: 'no-store',
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch posts');
    const json = await res.json();
    return json.data;
  } catch {
    return [];
  }
}

export async function publishPost(input: { authorName: string; authorRole?: string; authorEmail: string; content: string }): Promise<FeedPost> {
  const res = await fetch(`${API_BASE_URL}/posts`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  console.log(API_BASE_URL);

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to publish post');
  }
  const json = await res.json();
  return json.data;
}

export async function togglePostLike(
  id: string,
  increment: boolean,
  likerInfo?: { likerName?: string; likerEmail?: string }
): Promise<FeedPost> {
  const res = await fetch(`${API_BASE_URL}/posts/${id}/like`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      increment,
      likerName: likerInfo?.likerName,
      likerEmail: likerInfo?.likerEmail,
    }),
  });
  if (!res.ok) {
    throw new Error('Failed to update post like');
  }
  const json = await res.json();
  return json.data;
}

// -------------------------------------------------------------
// NOTIFICATIONS API
// -------------------------------------------------------------

export interface NotificationItem {
  id: string;
  recipientEmail: string;
  senderName: string;
  senderEmail?: string | null;
  type: string;
  postId?: string | null;
  postContent?: string | null;
  message: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function fetchNotifications(userEmail?: string): Promise<NotificationItem[]> {
  try {
    const url = userEmail
      ? `${API_BASE_URL}/notifications?email=${encodeURIComponent(userEmail)}`
      : `${API_BASE_URL}/notifications`;
    const res = await fetch(url, {
      cache: 'no-store',
      credentials: 'include',
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export async function markNotificationAsRead(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
      method: 'PATCH',
      credentials: 'include',
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function markAllNotificationsAsRead(userEmail: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/notifications/read-all`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipientEmail: userEmail }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// -------------------------------------------------------------
// WEBHOOKS & DELAYED EMAIL TESTING API
// -------------------------------------------------------------

export async function triggerTestEmail(email: string, name?: string, delayMs = 60000): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/webhooks/trigger-test-email`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, delayMs }),
    });
    const json = await res.json();
    return {
      success: res.ok,
      message: json.message || 'Scheduled 1-minute test email',
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to schedule test email',
    };
  }
}

export async function unsubscribeUser(email: string, reason?: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/webhooks/unsubscribe`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, reason }),
    });
    const json = await res.json();
    return {
      success: res.ok,
      message: json.message || 'Unsubscribed successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to process unsubscription',
    };
  }
}

export async function checkUnsubscribeStatus(email: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/webhooks/unsubscribe/check?email=${encodeURIComponent(email)}`, {
      cache: 'no-store',
      credentials: 'include',
    });
    if (!res.ok) return false;
    const json = await res.json();
    return Boolean(json.data?.isUnsubscribed);
  } catch {
    return false;
  }
}


