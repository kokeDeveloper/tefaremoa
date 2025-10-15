import { redirect } from 'next/navigation';

type SearchParams = {
  from?: string | string[];
};

type Props = {
  params: Promise<Record<string, string | string[]>>;
  searchParams: Promise<SearchParams>;
};

const coerceString = (value: string | string[] | undefined): string | undefined =>
  Array.isArray(value) ? value[0] : value;


export default async function AdminSSOPage({ searchParams }: Props) {
  const params = await searchParams;
  const from = coerceString(params.from) || '/admin';
  const ssoBase = process.env.NEXT_PUBLIC_SSO_URL;

  // Si no esta configurada la URL del proveedor SSO, mostrar fallback manual
  if (!ssoBase) {
    return (
      <main style={{ fontFamily: 'sans-serif', padding: 32, maxWidth: 600 }}>
        <h1>SSO no configurado</h1>
        <p>
          Falta la variable <code>NEXT_PUBLIC_SSO_URL</code>. Para pruebas locales puedes apuntarla al
          callback interno:
        </p>
        <pre style={{ background: '#eee', padding: 12, borderRadius: 4 }}>
{`NEXT_PUBLIC_SSO_URL=http://localhost:3000/api/auth/sso?email=admin%40example.com`}
        </pre>
        <p>
          Luego vuelve a <a href="/admin">/admin</a>.
        </p>
      </main>
    );
  }

  // Redirige al proveedor (o callback simulado) anadiendo 'from' si no existe
  const url = new URL(ssoBase);
  if (!url.searchParams.get('from')) {
    url.searchParams.set('from', from);
  }
  redirect(url.toString());
}