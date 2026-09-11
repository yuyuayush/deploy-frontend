import React from 'react';
import { SignUpUI } from '@/components/SignUpUI';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up • Better Auth & Neon DB',
  description: 'Create a new account with email/password or Google OAuth provider, persisted to Neon PostgreSQL.',
};

export default function SignUpPage() {
  return (
    <div className="py-8">
      <SignUpUI defaultMode="signup" />
    </div>
  );
}
