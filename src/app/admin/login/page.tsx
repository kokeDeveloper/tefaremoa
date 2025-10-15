"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export const dynamic = 'force-dynamic'

export default function AdminLoginPage() {
  const router = useRouter()
  const search = useSearchParams()
  const redirectTo = search?.get('from') || '/admin'

  const [email, setEmail] = useState('napatalama@gmail.com')
  const [password, setPassword] = useState('123momia')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!email || !password) {
      setError('Email y contraseña son requeridos')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data?.error || 'Error al iniciar sesión')
        return
      }

      // Successful login — cookie is set by the API. Redirect to original page.
      router.push(redirectTo)
    } catch (err: any) {
      setError(err?.message || 'Error de red')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900 px-4">
      <div className="flex w-full max-w-sm flex-col items-center gap-5">
        {/* Logo */}
        <div className="flex items-center justify-center">
          <Image
            src="/tefaremoa.svg"
            alt="Te Fare Mo'a"
            width={140}
            height={140}
            priority
            className="opacity-90"
          />
        </div>

        <form onSubmit={handleSubmit} className="w-full p-6 bg-neutral-800 rounded-lg shadow-md">
        <h2 className="text-lg font-medium mb-4">Acceso de administrador</h2>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <label className="block text-sm text-neutral-200 mb-1">Email</label>
        <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@ejemplo.com" className='bg-neutral-200 text-neutral-700 placeholder:text-neutral-500' />
        <label className="block text-sm text-neutral-200 mt-3 mb-1">Contraseña</label>
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" className='bg-neutral-200 text-neutral-700 placeholder:text-neutral-500' />

        <div className="mt-4">
          <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Ingresando...' : 'Entrar'}</Button>
        </div>
        </form>
      </div>
    </div>
  )
}
