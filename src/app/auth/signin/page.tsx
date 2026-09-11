import React from 'react';
import { SignUpUI } from '@/components/SignUpUI';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In • Better Auth & Neon DB',
  description: 'Sign into your account via email/password or Google OAuth provider.',
};

export default function SignInPage() {
  return (
    <div className="py-8">
      <SignUpUI defaultMode="signin" />
    </div>
  );
}
