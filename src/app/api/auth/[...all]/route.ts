import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:8080';

export async function GET(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const search = request.nextUrl.search;
  return NextResponse.redirect(`${BACKEND_URL}${path}${search}`);
}

export async function POST(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const search = request.nextUrl.search;
  return NextResponse.redirect(`${BACKEND_URL}${path}${search}`);
}
