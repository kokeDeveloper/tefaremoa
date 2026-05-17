'use client'
import React, { useCallback, useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import { IconEdit, IconTrash, IconUserPlus } from '@tabler/icons-react'

type Instructor = {
  id: number
  name: string
  email: string
  phone: string | null
}

type Form = { name: string; email: string; phone: string }
const EMPTY_FORM: Form = { name: '', email: '', phone: '' }

export default function InstructorManager() {
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<Form>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [toDelete, setToDelete] = useState<Instructor | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchInstructors = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/instructors', { credentials: 'include' })
      const data = await res.json()
      setInstructors(Array.isArray(data) ? data : [])
    } catch { /* ignore */ }
    setLoading(false)
  }, [])

  useEffect(() => { fetchInstructors() }, [fetchInstructors])

  const openCreate = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setFormError(null)
    setShowForm(true)
  }

  const openEdit = (i: Instructor) => {
    setEditingId(i.id)
    setForm({ name: i.name, email: i.email, phone: i.phone ?? '' })
    setFormError(null)
    setShowForm(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    if (!form.name.trim()) { setFormError('El nombre es obligatorio'); return }
    if (!form.email.trim()) { setFormError('El correo es obligatorio'); return }

    setSaving(true)
    try {
      const method = editingId ? 'PUT' : 'POST'
      const url = editingId ? `/api/instructors/${editingId}` : '/api/instructors'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone || null }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al guardar')
      setShowForm(false)
      fetchInstructors()
    } catch (err: any) {
      setFormError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    if (!toDelete) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/instructors/${toDelete.id}`, { method: 'DELETE', credentials: 'include' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setToDelete(null)
      fetchInstructors()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Instructores</h3>
        <Button className="bg-emerald-600 text-white text-xs px-3 py-1.5 hover:bg-emerald-700 flex items-center gap-1" onClick={openCreate}>
          <IconUserPlus size={14} /> Nuevo instructor
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-neutral-400">Cargando…</p>
      ) : instructors.length === 0 ? (
        <p className="text-sm text-neutral-400 italic">Sin instructores registrados.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-700 text-left text-neutral-500 dark:text-neutral-400">
              <th className="py-2 px-3 font-medium">Nombre</th>
              <th className="py-2 px-3 font-medium">Correo</th>
              <th className="py-2 px-3 font-medium">Teléfono</th>
              <th className="py-2 px-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {instructors.map((i) => (
              <tr key={i.id} className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                <td className="py-2.5 px-3 font-medium text-neutral-800 dark:text-neutral-200">{i.name}</td>
                <td className="py-2.5 px-3 text-neutral-600 dark:text-neutral-400">{i.email}</td>
                <td className="py-2.5 px-3 text-neutral-600 dark:text-neutral-400">{i.phone ?? '–'}</td>
                <td className="py-2.5 px-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => openEdit(i)} className="p-1.5 rounded hover:bg-sky-50 dark:hover:bg-sky-900/20 text-neutral-400 hover:text-sky-600 transition-colors" title="Editar">
                      <IconEdit size={16} />
                    </button>
                    <button onClick={() => setToDelete(i)} className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-neutral-400 hover:text-red-600 transition-colors" title="Eliminar">
                      <IconTrash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Form Modal */}
      <Modal open={showForm} title={editingId ? 'Editar instructor' : 'Nuevo instructor'} onClose={() => setShowForm(false)}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-2">
          <div>
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">Nombre *</label>
            <Input name="name" value={form.name} onChange={handleChange} placeholder="Nombre completo" />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">Correo *</label>
            <Input type="email" name="email" value={form.email} onChange={handleChange} placeholder="correo@ejemplo.com" />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">Teléfono</label>
            <Input name="phone" value={form.phone} onChange={handleChange} placeholder="+689 00 00 00" />
          </div>
          {formError && <p className="text-xs text-red-500">{formError}</p>}
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" className="bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200" onClick={() => setShowForm(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50" disabled={saving}>
              {saving ? 'Guardando…' : editingId ? 'Guardar' : 'Crear'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal open={toDelete !== null} title="¿Eliminar instructor?" onClose={() => setToDelete(null)}>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
          ¿Eliminar a <strong>{toDelete?.name}</strong>? Solo puedes eliminar instructores sin clases asignadas.
        </p>
        <div className="flex justify-end gap-2">
          <Button className="bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200" onClick={() => setToDelete(null)} disabled={deleting}>
            Cancelar
          </Button>
          <Button className="bg-red-600 text-white hover:bg-red-700 disabled:opacity-50" onClick={confirmDelete} disabled={deleting}>
            {deleting ? 'Eliminando…' : 'Eliminar'}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
