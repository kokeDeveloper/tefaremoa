"use client"
import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import StudentForm from './StudentForm'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'

type Student = {
  id: number
  name: string
  lastName?: string | null
  email: string
  planType?: string | null
  planStatus?: string | null
}

interface Props {
  students: Student[]
  onDeleted?: () => void
}

export default function StudentList({ students, onDeleted }: Props) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [toDelete, setToDelete] = useState<number | null>(null)
  const [sendingId, setSendingId] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)

  const editingStudent = useMemo(
    () => students.find((student) => student.id === editingId) || null,
    [students, editingId]
  )

  const confirmDelete = async () => {
    if (!toDelete) return
    await fetch('/api/students/' + toDelete, { method: 'DELETE' })
    setToDelete(null)
    onDeleted?.()
  }

  const sendPassword = async (studentId: number) => {
    setFeedback(null)
    setSendingId(studentId)
    try {
      const res = await fetch('/api/students/send-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data.error || 'No se pudo enviar la contraseña')
      }

      setFeedback('Contraseña temporal enviada por correo.')
    } catch (err: any) {
      setFeedback(err?.message || 'No se pudo enviar la contraseña.')
    } finally {
      setSendingId(null)
    }
  }

  if (!students || students.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 p-6 text-sm text-neutral-500 text-center">
        No hay alumnas registradas todavía.
      </div>
    )
  }

  return (
    <>
      <div className="overflow-auto border border-neutral-200 dark:border-neutral-700 rounded-lg">
        <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700 text-sm">
          <thead className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200">
            <tr>
              <th className="px-3 py-2 text-left font-semibold">ID</th>
              <th className="px-3 py-2 text-left font-semibold">Nombre</th>
              <th className="px-3 py-2 text-left font-semibold">Correo</th>
              <th className="px-3 py-2 text-left font-semibold">Plan</th>
              <th className="px-3 py-2 text-left font-semibold">Estado</th>
              <th className="px-3 py-2 text-left font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {students.map((student) => (
              <React.Fragment key={student.id}>
                <tr className="bg-white dark:bg-neutral-900">
                  <td className="px-3 py-3 font-mono text-xs text-neutral-500">#{student.id}</td>
                  <td className="px-3 py-3">
                    <div className="font-medium">
                      {student.name} {student.lastName ?? ''}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="truncate max-w-[220px] md:max-w-none">{student.email}</div>
                  </td>
                  <td className="px-3 py-3">{student.planType ?? '—'}</td>
                  <td className="px-3 py-3">
                    <span className="inline-flex items-center gap-2">
                      <StatusBadge status={student.planStatus} />
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/admin/students/${student.id}`}
                        className="px-3 py-1 text-xs font-semibold uppercase tracking-wide rounded border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                      >
                        Ver
                      </Link>
                      <button
                        onClick={() => setEditingId(student.id)}
                        className="px-3 py-1 text-xs font-semibold uppercase tracking-wide rounded border border-amber-400 text-amber-600 hover:bg-amber-500/10 transition"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => sendPassword(student.id)}
                        disabled={sendingId === student.id}
                        className="px-3 py-1 text-xs font-semibold uppercase tracking-wide rounded border border-emerald-500 text-emerald-600 hover:bg-emerald-500/10 transition disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {sendingId === student.id ? 'Enviando…' : 'Enviar contraseña'}
                      </button>
                      <button
                        onClick={() => setToDelete(student.id)}
                        className="px-3 py-1 text-xs font-semibold uppercase tracking-wide rounded border border-red-500 text-red-500 hover:bg-red-500/10 transition"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
                {editingId === student.id && editingStudent && (
                  <tr className="bg-neutral-50 dark:bg-neutral-900/60">
                    <td colSpan={6} className="px-3 py-4">
                      <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-950 p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-semibold">Editar alumna</h4>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-xs font-semibold uppercase tracking-wide text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
                          >
                            Cerrar
                          </button>
                        </div>
                        <StudentForm
                          initial={editingStudent}
                          variant="embedded"
                          onSaved={() => {
                            setEditingId(null)
                            onDeleted?.()
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={!!toDelete} title="Confirmar eliminación" onClose={() => setToDelete(null)}>
        <div>¿Seguro que desea eliminar a esta alumna?</div>
        <div className="mt-4 flex justify-end gap-2">
          <Button onClick={() => setToDelete(null)} className="border">Cancelar</Button>
          <Button onClick={confirmDelete} className="bg-red-600">Eliminar</Button>
        </div>
      </Modal>

      {feedback && (
        <div className="mt-3 rounded-lg border border-neutral-200 bg-white p-3 text-sm text-neutral-700 shadow-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100">
          {feedback}
        </div>
      )}
    </>
  )
}

function StatusBadge({ status }: { status?: string | null }) {
  if (!status) {
    return (
      <span className="px-2 py-1 text-xs font-semibold rounded bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200">
        Sin estado
      </span>
    )
  }

  const normalized = status.toLowerCase()
  const styles: Record<string, string> = {
    expired: 'bg-red-600 text-white',
    expiringsoon: 'bg-amber-500 text-neutral-900',
    active: 'bg-emerald-600 text-white',
    noplan: 'bg-neutral-500 text-white',
  }

  const className = styles[normalized] ?? 'bg-neutral-400 text-neutral-900'

  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded ${className}`}>
      {status}
    </span>
  )
}
