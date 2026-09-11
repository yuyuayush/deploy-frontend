'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { createUser } from './api';
import { CreateUserInput } from '@/types';

/**
 * Server Action for On-Demand ISR Revalidation.
 * Revalidates the `/isr` path and the 'users' cache tag immediately.
 */
export async function triggerIsrRevalidation() {
  try {
    revalidatePath('/isr');
    revalidateTag('users');
    return {
      success: true,
      timestamp: new Date().toISOString(),
      message: 'On-demand ISR revalidation completed successfully! Fresh cache primed.',
    };
  } catch (error) {
    return {
      success: false,
      timestamp: new Date().toISOString(),
      message: `Revalidation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Server Action to create a user and revalidate dependent paths
 */
export async function handleCreateUserServerAction(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const role = (formData.get('role') as 'admin' | 'user' | 'editor') || 'user';

  if (!name || !email) {
    return { success: false, error: 'Name and Email are required fields.' };
  }

  const input: CreateUserInput = { name, email, role };
  const user = await createUser(input);

  // Trigger cache revalidations across static/ISR pages
  revalidatePath('/isr');
  revalidatePath('/ssr');
  revalidateTag('users');

  return { success: true, user };
}
