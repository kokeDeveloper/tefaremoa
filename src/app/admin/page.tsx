import { redirect } from 'next/navigation';
import { cookies, headers } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import AdminDashboardClientPage from './AdminDashboardClient';

type AdminSearchParams = {
  from?: string | string[];
  force_sso?: string | string[];
  reason?: string | string[];
};

type PagePropsLike<SearchParams> = {
  params: Promise<Record<string, string | string[]>>;
  searchParams: Promise<SearchParams>;
};

type Props = PagePropsLike<AdminSearchParams>;

const coerceString = (value: string | string[] | undefined): string | undefined =>
  Array.isArray(value) ? value[0] : value;

const truthy = (value: string | undefined): boolean =>
  ['1', 'true', 'TRUE', 'yes', 'YES'].includes(value ?? '');

const DEFAULT_ADMIN_HOME = '/admin';
const RESERVED_REDIRECTS = new Set(['/admin', '/admin/login', '/admin/sso']);

const normalizeAdminTarget = (value: string | undefined): string => {
  if (value && value.startsWith('/admin')) {
    return value;
  }
  return DEFAULT_ADMIN_HOME;
};

export default async function AdminSSOPage({ searchParams }: Props) {
  const params = await searchParams;
  const from = normalizeAdminTarget(coerceString(params.from));
  const ssoBase = process.env.NEXT_PUBLIC_SSO_URL;
  const forceEnv = truthy(process.env.FORCE_SSO) || truthy(process.env.NEXT_PUBLIC_FORCE_SSO);
  const forceParam = truthy(coerceString(params.force_sso));
  const isDev = process.env.NODE_ENV === 'development';
  const shouldForceSso = forceEnv || forceParam;

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const payload = token ? verifyToken(token) : null;

  if (payload && !shouldForceSso) {
    if (!RESERVED_REDIRECTS.has(from)) {
      redirect(from);
    }
    return <AdminDashboardClientPage />;
  }

  if (isDev && !shouldForceSso) {
    const nextParams = new URLSearchParams({ from });
    const reason = coerceString(params.reason);
    if (reason) {
      nextParams.set('reason', reason);
    }
    redirect(`/admin/login?${nextParams.toString()}`);
  }

  // Si no está configurada la URL del proveedor SSO, mostrar fallback manual
  if (!ssoBase) {
    return (
      <main style={{ fontFamily: 'sans-serif', padding: 32, maxWidth: 600 }}>
        <h1>SSO no configurado</h1>
        <p>
          Falta la variable <code>NEXT_PUBLIC_SSO_URL</code>. Para pruebas locales puedes apuntarla al
          callback interno:
        </p>
        <pre style={{ background: '#eee', padding: 12, borderRadius: 4 }}>
{`NEXT_PUBLIC_SSO_URL=/api/auth/sso?email=admin%40example.com`}
        </pre>
        <p>
          Luego vuelve a <a href="/admin">/admin</a>.
        </p>
      </main>
    );
  }

  // Normaliza la URL de SSO para respetar el host/puerto actual en entornos locales
  const hdrs = await headers();
  const host = hdrs.get('x-forwarded-host') ?? hdrs.get('host') ?? 'localhost:3000';
  const proto = (hdrs.get('x-forwarded-proto') ?? 'http').replace(/:$/, '');
  const origin = `${proto}://${host}`;

  let finalSSO: string;
  try {
    if (ssoBase.startsWith('/')) {
      // Ruta relativa: úsala con el origin actual.
      finalSSO = origin + ssoBase;
    } else {
      const candidate = new URL(ssoBase);
      // Si apunta a localhost/127.0.0.1, ajusta al host/puerto actuales
      if (candidate.hostname === 'localhost' || candidate.hostname === '127.0.0.1') {
        candidate.protocol = proto + ':';
        candidate.host = host; // conserva puerto actual
        finalSSO = candidate.toString();
      } else {
        finalSSO = candidate.toString();
      }
    }
  } catch {
    // Si la variable es inválida, cae a una ruta local por defecto
    finalSSO = origin + '/api/auth/sso';
  }

  // Redirige al proveedor (o callback simulado) añadiendo 'from' si no existe
  const url = new URL(finalSSO);
  if (!url.searchParams.get('from')) {
    url.searchParams.set('from', from);
  }
  redirect(url.toString());
}