export function normalizeSsoUrl(params: {
  ssoBase?: string | null;
  from: string;
  headers: Headers;
  role?: string;
}): string {
  const { ssoBase, from, headers, role } = params;

  const configuredOrigin = process.env.NEXT_PUBLIC_BASE_URL;
  const configuredOriginUrl = configuredOrigin ? new URL(configuredOrigin) : null;
  const host = headers.get('x-forwarded-host') ?? headers.get('host') ?? 'localhost:3000';
  const proto = (headers.get('x-forwarded-proto') ?? 'http').replace(/:$/, '');
  const originFromHeaders = `${proto}://${host}`;
  const origin = (configuredOrigin ?? originFromHeaders).replace(/\/$/, '');

  if (!ssoBase) {
    const fallback = new URL('/api/auth/sso', origin);
    fallback.searchParams.set('from', from);
    return fallback.toString();
  }

  try {
    let finalUrl: string;
    if (ssoBase.startsWith('/')) {
      finalUrl = origin + ssoBase;
    } else {
      const candidate = new URL(ssoBase);
      if (candidate.hostname === 'localhost' || candidate.hostname === '127.0.0.1') {
        if (configuredOriginUrl) {
          candidate.protocol = configuredOriginUrl.protocol;
          candidate.host = configuredOriginUrl.host;
        } else {
          candidate.protocol = `${proto}:`;
          candidate.host = host;
        }
      }
      finalUrl = candidate.toString();
    }

    const url = new URL(finalUrl);
    if (!url.searchParams.get('from')) {
      url.searchParams.set('from', from);
    }
    if (role && !url.searchParams.get('role')) {
      url.searchParams.set('role', role);
    }
    return url.toString();
  } catch {
    const fallback = new URL('/api/auth/sso', origin);
    fallback.searchParams.set('from', from);
    if (role) {
      fallback.searchParams.set('role', role);
    }
    return fallback.toString();
  }
}
