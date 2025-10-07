import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './src/lib/jwt';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const forceEnv =
    (process.env.FORCE_SSO || process.env.NEXT_PUBLIC_FORCE_SSO) === '1' ||
    (process.env.FORCE_SSO || process.env.NEXT_PUBLIC_FORCE_SSO) === 'true';
  const forceParam = req.nextUrl.searchParams.get('force_sso');
  const forceParamEnabled = forceParam === '1' || forceParam === 'true';

  // Only protect admin routes (but allow the login page and API routes)
  if (pathname.startsWith('/admin')) {
    const publicAdminPaths = ['/admin/login', '/admin/sso'];
    if (
      publicAdminPaths.includes(pathname) ||
      pathname.startsWith('/api') ||
      pathname.includes('.')
    ) {
      return NextResponse.next();
    }

    // If FORCE_SSO is enabled, force SSO for the exact /admin entry or via ?force_sso=1
    if (pathname === '/admin' && (forceEnv || forceParamEnabled)) {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/sso';
      url.search = `from=${encodeURIComponent(pathname)}`;
      return NextResponse.redirect(url);
    }

    const token = req.cookies.get('token')?.value;
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/sso';
      url.search = `from=${encodeURIComponent(pathname)}`;
      return NextResponse.redirect(url);
    }

    const payload = verifyToken(token);
    if (!payload) {
  const url = req.nextUrl.clone();
  url.pathname = '/admin/sso';
  url.search = `from=${encodeURIComponent(pathname)}&reason=invalid_token`;
  return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
