"use client"
import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function AdminSSO() {
  const search = useSearchParams()
  const router = useRouter()
  const from = search?.get('from') || '/admin'

  useEffect(() => {
    const sso = process.env.NEXT_PUBLIC_SSO_URL
    if (sso) {
      // Attach original path so SSO can redirect back
      const sep = sso.includes('?') ? '&' : '?'
      window.location.href = `${sso}${sep}from=${encodeURIComponent(from)}`
      return
    }
    // fallback to local login
    router.replace(`/admin/login?from=${encodeURIComponent(from)}`)
  }, [from, router, search])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="mb-2">Redirigiendo al proveedor SSO…</p>
        <p className="text-sm text-neutral-500">Si no se redirige, <a href={`/admin/login?from=${encodeURIComponent(from)}`} className="underline">usa el login local</a>.</p>
      </div>
    </div>
  )
}
