import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Public admin paths que no requieren cookie
const PUBLIC_ADMIN_PATHS = new Set<string>(['/admin/sso', '/admin/login']);

/**
 * Decodifica (sin verificar firma) un JWT para extraer el payload.
 * Solo se usa en el middleware para lectura rápida del 'exp'.
 * La verificación criptográfica REAL ocurre en el server (páginas / APIs) usando jsonwebtoken.
 */
function decodeJwt(token: string): any | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payloadPart = parts[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .padEnd(Math.ceil(parts[1].length / 4) * 4, '=');
    const json = atob(payloadPart);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function isTrue(val: string | undefined | null) {
  if (!val) return false;
  return ['1', 'true', 'TRUE', 'yes', 'YES'].includes(val);
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Solo nos interesa /admin/*
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Permitir estáticos (assets dentro de /admin)
  if (pathname.includes('.') && !pathname.endsWith('.html')) {
    return NextResponse.next();
  }

  // Permitir rutas públicas
  if (PUBLIC_ADMIN_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  const forceEnv =
    isTrue(process.env.FORCE_SSO) ||
    isTrue(process.env.NEXT_PUBLIC_FORCE_SSO);

  const forceParam = isTrue(req.nextUrl.searchParams.get('force_sso'));

  const token = req.cookies.get('token')?.value;

  const redirectTo = (target: string, params: Record<string, string | undefined> = {}) => {
    const url = req.nextUrl.clone();
    url.pathname = target;
    const sp = new URLSearchParams();
    sp.set('from', pathname);
    Object.entries(params).forEach(([k, v]) => v && sp.set(k, v));
    url.search = sp.toString();
    return NextResponse.redirect(url);
  };

  // Si no hay token → redirigir
  if (!token) {
    if (forceEnv || forceParam || pathname === '/admin') {
      return redirectTo('/admin/sso', { reason: 'no_token' });
    }
    // Si en un futuro quieres /admin/login como alternativa local
    return redirectTo('/admin/sso', { reason: 'no_token' });
  }

  // Decodificar exp (sin verificar firma)
  const payload = decodeJwt(token);
  if (!payload) {
    return redirectTo('/admin/sso', { reason: 'invalid_format' });
  }

  if (payload.exp && Date.now() / 1000 > payload.exp) {
    return redirectTo('/admin/sso', { reason: 'expired' });
  }

  // Si todo ok
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};