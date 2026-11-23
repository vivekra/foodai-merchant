import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('foodai_token')?.value;

  // Merchant protected routes
  const isMerchantProtected =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/menu') ||
    pathname.startsWith('/orders') ||
    pathname.startsWith('/analytics') ||
    pathname.startsWith('/reviews') ||
    pathname.startsWith('/payouts') ||
    pathname.startsWith('/settings');

  if (isMerchantProtected && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/menu/:path*',
    '/orders/:path*',
    '/analytics/:path*',
    '/reviews/:path*',
    '/payouts/:path*',
    '/settings/:path*',
  ],
};
