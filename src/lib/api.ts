import { User, CreateUserInput, ApiSuccessResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

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
