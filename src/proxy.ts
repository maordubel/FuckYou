import { NextResponse, type NextRequest } from 'next/server';
import { VOTER_COOKIE } from '@/lib/voter';

const YEAR_SECONDS = 60 * 60 * 24 * 365;

export function proxy(request: NextRequest) {
  const existing = request.cookies.get(VOTER_COOKIE)?.value;
  const voter = existing ?? crypto.randomUUID();

  // Make it readable by the render pass of this same request, not only the next one.
  request.cookies.set(VOTER_COOKIE, voter);
  const response = NextResponse.next({ request });

  if (!existing) {
    response.cookies.set(VOTER_COOKIE, voter, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: YEAR_SECONDS,
    });
  }
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|brand|hq|api).*)'],
};
