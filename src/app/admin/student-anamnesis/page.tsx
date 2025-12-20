"use client";

import React, { useEffect, useState } from 'react';
import AnamnesisPage from '@/app/anamnesis/page';

// Reutiliza el formulario público dentro del layout de admin (token student requerido por middleware)
export default function StudentAnamnesisDashboard() {
  const [name, setName] = useState<string>('');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch('/api/student/me', { credentials: 'include' });
        const data = await res.json().catch(() => ({}));
        if (!mounted) return;
        if (res.ok) {
          setName(data?.name || '');
        }
      } catch {
        // ignore
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return <AnamnesisPage studentName={name} />;
}
