import { NextRequest, NextResponse } from 'next/server';

const getBackendUrl = () => {
  const url =
    process.env.NEXT_PUBLIC_AUTH_URL ||
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, '') ||
    'http://localhost:8080';
  return url.replace(/\/+$/, '');
};

async function handler(request: NextRequest) {
  const backendBase = getBackendUrl();
  const path = request.nextUrl.pathname;
  const search = request.nextUrl.search;
  const targetUrl = `${backendBase}${path}${search}`;

  const headers = new Headers(request.headers);
  headers.set('host', new URL(backendBase).host);

  const body =
    request.method !== 'GET' && request.method !== 'HEAD'
      ? await request.arrayBuffer()
      : undefined;

  try {
    const res = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
      redirect: 'manual',
      cache: 'no-store',
    });

    const responseHeaders = new Headers(res.headers);

    return new NextResponse(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Backend auth proxy error' },
      { status: 502 }
    );
  }
}

export { handler as GET, handler as POST, handler as PUT, handler as PATCH, handler as DELETE };
