import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  const path = request.nextUrl.searchParams.get('path');
  const tag = request.nextUrl.searchParams.get('tag');

  // Basic secret verification (optional override via env)
  const EXPECTED_SECRET = process.env.REVALIDATION_SECRET || 'revalidate-secret-key';
  if (secret !== EXPECTED_SECRET && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ message: 'Invalid secret key' }, { status: 401 });
  }

  try {
    if (path) {
      revalidatePath(path);
    }
    if (tag) {
      revalidateTag(tag);
    }
    if (!path && !tag) {
      revalidatePath('/isr');
      revalidateTag('users');
    }

    return NextResponse.json({
      revalidated: true,
      now: new Date().toISOString(),
      path: path || '/isr',
      tag: tag || 'users',
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error revalidating', error: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    );
  }
}
