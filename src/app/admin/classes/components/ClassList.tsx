'use client'
import React, { useState } from 'react'
import { IconEdit, IconTrash, IconUsers, IconScan } from '@tabler/icons-react'
import { ClassRecord } from './ClassForm'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'

interface Props {
  classes: ClassRecord[]
  onEdit: (cls: ClassRecord) => void
  onDeleted: () => void
  onSelectDetail: (id: number) => void
}

export default function ClassList({ classes, onEdit, onDeleted, onSelectDetail }: Props) {
  const [toDelete, setToDelete] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  const confirmDelete = async () => {
    if (!toDelete) return
    setDeleting(true)
    await fetch(`/api/classes/${toDelete}`, { method: 'DELETE', credentials: 'include' })
    setDeleting(false)
    setToDelete(null)
    onDeleted()
  }

  if (classes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-neutral-400">
        <IconUsers size={40} className="mb-3 opacity-30" />
        <p className="text-sm">No hay clases registradas.</p>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-700 text-left text-neutral-500 dark:text-neutral-400">
              <th className="py-2 px-3 font-medium">Clase</th>
              <th className="py-2 px-3 font-medium">Instructor</th>
              <th className="py-2 px-3 font-medium">Horario</th>
              <th className="py-2 px-3 font-medium text-center">Inscritas / Cap.</th>
              <th className="py-2 px-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((cls) => {
              const enrolled = cls._count?.enrollments ?? 0
              const isFull = enrolled >= cls.capacity
              const scheduleDate = new Date(cls.schedule)
              const scheduleLabel = scheduleDate.toLocaleString('es-PF', {
                weekday: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })
              return (
                <tr
                  key={cls.id}
                  className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                >
                  <td className="py-2.5 px-3 font-medium text-neutral-800 dark:text-neutral-200">{cls.name}</td>
                  <td className="py-2.5 px-3 text-neutral-600 dark:text-neutral-400">{cls.instructor?.name ?? '–'}</td>
                  <td className="py-2.5 px-3 text-neutral-600 dark:text-neutral-400 capitalize">{scheduleLabel}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className={`font-semibold ${isFull ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-700 dark:text-emerald-400'}`}>
                      {enrolled}
                    </span>
                    <span className="text-neutral-400"> / {cls.capacity}</span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onSelectDetail(cls.id)}
                        className="p-1.5 rounded hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-neutral-400 hover:text-emerald-600 transition-colors"
                        title="Ver inscritas"
                      >
                        <IconUsers size={16} />
                      </button>
                      <a
                        href={`/admin/scanner/${cls.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-2 py-1 rounded-md bg-violet-600/15 hover:bg-violet-600/30 text-violet-400 hover:text-violet-300 text-xs font-medium transition-colors border border-violet-500/20"
                        title="Pasar lista / escáner QR"
                      >
                        <IconScan size={14} /> Lista
                      </a>
                      <button
                        onClick={() => onEdit(cls)}
                        className="p-1.5 rounded hover:bg-sky-50 dark:hover:bg-sky-900/20 text-neutral-400 hover:text-sky-600 transition-colors"
                        title="Editar"
                      >
                        <IconEdit size={16} />
                      </button>
                      <button
                        onClick={() => setToDelete(cls.id)}
                        className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-neutral-400 hover:text-red-600 transition-colors"
                        title="Eliminar"
                      >
                        <IconTrash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <Modal open={toDelete !== null} title="¿Eliminar clase?" onClose={() => setToDelete(null)}>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
          Se eliminarán también todas las inscripciones y registros de asistencia de esta clase. Esta acción no se puede deshacer.
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
    </>
  )
}
