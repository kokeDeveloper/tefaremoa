'use client'
import React, { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

type Instructor = { id: number; name: string }

type ClassPayload = {
  name: string
  schedule: string
  capacity: number
  instructorId: number
}

export type ClassRecord = {
  id: number
  name: string
  schedule: string
  capacity: number
  instructorId: number
  instructor?: { id: number; name: string }
  _count?: { enrollments: number }
}

interface Props {
  initial?: ClassRecord | null
  onSaved: () => void
  onCancel: () => void
}

export default function ClassForm({ initial, onSaved, onCancel }: Props) {
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [form, setForm] = useState<ClassPayload>({
    name: initial?.name ?? '',
    schedule: initial ? new Date(initial.schedule).toISOString().slice(0, 16) : '',
    capacity: initial?.capacity ?? 15,
    instructorId: initial?.instructorId ?? 0,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/instructors', { credentials: 'include' })
      .then((r) => r.json())
      .then(setInstructors)
      .catch(() => {})
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: name === 'capacity' || name === 'instructorId' ? Number(value) : value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!form.name.trim()) { setError('El nombre es obligatorio'); return }
    if (!form.schedule) { setError('El horario es obligatorio'); return }
    if (!form.instructorId) { setError('Selecciona un instructor'); return }
    if (form.capacity < 1) { setError('La capacidad debe ser al menos 1'); return }

    setSaving(true)
    try {
      const method = initial ? 'PUT' : 'POST'
      const url = initial ? `/api/classes/${initial.id}` : '/api/classes'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al guardar')
      onSaved()
    } catch (err: any) {
      setError(err.message || 'Error inesperado')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          Nombre de la clase <span className="text-red-500">*</span>
        </label>
        <Input name="name" value={form.name} onChange={handleChange} placeholder="Ej: Ori Tahiti – Nivel Básico" />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          Horario <span className="text-red-500">*</span>
        </label>
        <Input type="datetime-local" name="schedule" value={form.schedule} onChange={handleChange} />
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Capacidad máx. <span className="text-red-500">*</span>
          </label>
          <Input type="number" name="capacity" value={form.capacity} onChange={handleChange} min={1} />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Instructor <span className="text-red-500">*</span>
          </label>
          <select
            name="instructorId"
            value={form.instructorId}
            onChange={handleChange}
            className="w-full rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value={0}>Seleccionar…</option>
            {instructors.map((i) => (
              <option key={i.id} value={i.id}>{i.name}</option>
            ))}
          </select>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex justify-end gap-2 pt-1">
        <Button type="button" className="bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-600" onClick={onCancel} disabled={saving}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50" disabled={saving}>
          {saving ? 'Guardando…' : initial ? 'Guardar cambios' : 'Crear clase'}
        </Button>
      </div>
    </form>
  )
}
