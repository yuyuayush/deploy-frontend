import { createAuthClient } from 'better-auth/react';

/**
 * Better Auth React Client connected directly to Express Backend (http://localhost:8080)
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:8080',
});

export const { useSession, signIn, signUp, signOut } = authClient;
