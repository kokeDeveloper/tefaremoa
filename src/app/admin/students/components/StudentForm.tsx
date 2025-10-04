"use client"
import React, { useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function StudentForm({initial, onSaved}:{initial?:any, onSaved:()=>void}){
  const [form, setForm] = useState({ firstName: initial?.name||'', lastName: initial?.lastName||'', email: initial?.email||'', password: '' });
  const [error, setError] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e:React.FormEvent)=>{
    e.preventDefault();
    setError(null); setLoading(true);
    try{
      const method = initial?.id ? 'PUT' : 'POST';
      const url = initial?.id ? `/api/students/${initial.id}` : '/api/students';
      const payload:any = { firstName: form.firstName, lastName: form.lastName, email: form.email };
      if(!initial?.id) payload.password = form.password;
      const res = await fetch(url, { method, headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
      if(!res.ok){ const j = await res.json(); setError(j.error || 'Error'); return; }
      onSaved();
    }catch(e:any){ setError(String(e)); }
    finally{ setLoading(false); }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Input required value={form.firstName} onChange={e=>setForm({...form, firstName: e.target.value})} placeholder="Nombre" />
        <Input required value={form.lastName} onChange={e=>setForm({...form, lastName: e.target.value})} placeholder="Apellido" />
      </div>
      <div className="flex gap-2">
        <Input required value={form.email} onChange={e=>setForm({...form, email: e.target.value})} placeholder="Email" className="w-full" />
        {!initial?.id && <Input required value={form.password} onChange={e=>setForm({...form, password: e.target.value})} placeholder="Password" className="w-48" />}
      </div>
      {error && <div className="text-red-500">{error}</div>}
      <div>
        <Button className="" disabled={loading}>{initial?.id ? 'Actualizar' : 'Crear'}</Button>
      </div>
    </form>
  )
}
