"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export const dynamic = 'force-dynamic';

export default function StudentLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/student/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || 'Error al iniciar sesión');
        return;
      }
      if (data?.mustChangePassword) {
        router.push('/admin/student-password');
        return;
      }
      router.push('/admin/student');
    } catch (err: any) {
      setError(err?.message || 'Error de red');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900 px-4">
      <div className="flex w-full max-w-sm flex-col items-center gap-5">
        <form onSubmit={handleSubmit} className="w-full rounded-xl bg-neutral-800 p-6 shadow-lg">
          <h2 className="mb-4 text-lg font-semibold text-white">Acceso de alumna</h2>
          {error && (
            <div className="mb-3 rounded border border-red-500/60 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {error}
            </div>
          )}
          <label className="block text-sm text-neutral-200 mb-1">Email</label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="alumna@ejemplo.com" className='bg-neutral-200 text-neutral-800 placeholder:text-neutral-500' />
          <label className="block text-sm text-neutral-200 mt-3 mb-1">Contraseña</label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" className='bg-neutral-200 text-neutral-800 placeholder:text-neutral-500' />

          <div className="mt-4">
            <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Ingresando...' : 'Entrar'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
