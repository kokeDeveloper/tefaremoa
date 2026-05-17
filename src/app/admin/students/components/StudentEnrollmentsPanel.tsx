'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { IconTrash, IconPlus, IconAlertTriangle, IconSchool } from '@tabler/icons-react'
import Button from '@/components/ui/Button'

type ClassOption = {
  id: number
  name: string
  schedule: string
  capacity: number
  instructor: { id: number; name: string }
  _count: { enrollments: number }
}

type EnrolledClass = {
  id: number          // enrollment id
  classId: number
  class: ClassOption
}

interface Props {
  studentId: number
  planStatus: string | null
  enrollments: EnrolledClass[]
  onUpdated: () => void
}

export default function StudentEnrollmentsPanel({ studentId, planStatus, enrollments, onUpdated }: Props) {
  const [allClasses, setAllClasses] = useState<ClassOption[]>([])
  const [loadingClasses, setLoadingClasses] = useState(false)
  const [selectedClassId, setSelectedClassId] = useState<number>(0)
  const [enrolling, setEnrolling] = useState(false)
  const [removingId, setRemovingId] = useState<number | null>(null)
  const [enrollError, setEnrollError] = useState<string | null>(null)
  const [showSelector, setShowSelector] = useState(false)

  const enrolledClassIds = new Set(enrollments.map((e) => e.classId))

  const isPlanExpired = planStatus === 'Expired'
  const isPlanExpiringSoon = planStatus === 'ExpiringSoon'

  const fetchClasses = useCallback(async () => {
    setLoadingClasses(true)
    try {
      const res = await fetch('/api/classes', { credentials: 'include' })
      const data = await res.json()
      setAllClasses(Array.isArray(data) ? data : [])
    } catch { /* ignore */ }
    setLoadingClasses(false)
  }, [])

  const handleShowSelector = () => {
    setShowSelector(true)
    setEnrollError(null)
    setSelectedClassId(0)
    if (allClasses.length === 0) fetchClasses()
  }

  const handleEnroll = async () => {
    if (!selectedClassId) { setEnrollError('Selecciona una clase'); return }
    setEnrollError(null)
    setEnrolling(true)
    try {
      const res = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ studentId, classId: selectedClassId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al inscribir')
      setShowSelector(false)
      setSelectedClassId(0)
      onUpdated()
    } catch (e: any) {
      setEnrollError(e.message)
    } finally {
      setEnrolling(false)
    }
  }

  const handleRemove = async (enrollmentId: number) => {
    setRemovingId(enrollmentId)
    try {
      await fetch(`/api/enrollments/${enrollmentId}`, { method: 'DELETE', credentials: 'include' })
      onUpdated()
    } catch { /* ignore */ }
    setRemovingId(null)
  }

  const availableClasses = allClasses.filter(
    (c) => !enrolledClassIds.has(c.id) && c._count.enrollments < c.capacity
  )

  const formatSchedule = (date: string) =>
    new Date(date).toLocaleString('es-PF', {
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit',
    })

  return (
    <div className="space-y-4">
      {/* Plan status warnings */}
      {isPlanExpired && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-400">
          <IconAlertTriangle size={16} className="shrink-0" />
          <span>El plan de esta alumna está <strong>vencido</strong>. Puede inscribirla de todas formas, pero se recomienda renovar el plan primero.</span>
        </div>
      )}
      {isPlanExpiringSoon && (
        <div className="flex items-center gap-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
          <IconAlertTriangle size={16} className="shrink-0" />
          <span>El plan de esta alumna está <strong>por vencer</strong>. Recuerda notificarle la renovación.</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {enrollments.length === 0
            ? 'Sin clases inscritas'
            : `${enrollments.length} clase${enrollments.length === 1 ? '' : 's'} inscrita${enrollments.length === 1 ? '' : 's'}`}
        </p>
        {!showSelector && (
          <Button
            className="bg-emerald-600 text-white text-xs px-3 py-1.5 hover:bg-emerald-700 flex items-center gap-1"
            onClick={handleShowSelector}
          >
            <IconPlus size={14} /> Inscribir en clase
          </Button>
        )}
      </div>

      {/* Class selector */}
      {showSelector && (
        <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 p-4 space-y-3">
          <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Seleccionar clase</p>
          {loadingClasses ? (
            <p className="text-sm text-neutral-400">Cargando clases…</p>
          ) : availableClasses.length === 0 ? (
            <p className="text-sm text-neutral-400 italic">No hay clases disponibles con cupo.</p>
          ) : (
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(Number(e.target.value))}
              className="w-full rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value={0}>Seleccionar clase…</option>
              {availableClasses.map((c) => {
                const spots = c.capacity - c._count.enrollments
                const schedule = new Date(c.schedule).toLocaleString('es-PF', {
                  weekday: 'short', hour: '2-digit', minute: '2-digit',
                })
                return (
                  <option key={c.id} value={c.id}>
                    {c.name} — {schedule} · {c.instructor.name} ({spots} lugar{spots === 1 ? '' : 'es'})
                  </option>
                )
              })}
            </select>
          )}
          {enrollError && <p className="text-xs text-red-500">{enrollError}</p>}
          <div className="flex gap-2">
            <Button
              className="bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 text-xs px-3 py-1.5"
              onClick={() => { setShowSelector(false); setEnrollError(null) }}
              disabled={enrolling}
            >
              Cancelar
            </Button>
            <Button
              className="bg-emerald-600 text-white text-xs px-3 py-1.5 hover:bg-emerald-700 disabled:opacity-50"
              onClick={handleEnroll}
              disabled={enrolling || !selectedClassId}
            >
              {enrolling ? 'Inscribiendo…' : 'Confirmar inscripción'}
            </Button>
          </div>
        </div>
      )}

      {/* Enrolled list */}
      {enrollments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-neutral-300 dark:text-neutral-600">
          <IconSchool size={36} className="mb-2" />
          <p className="text-sm text-neutral-400">Esta alumna no está inscrita en ninguna clase.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {enrollments.map((e) => {
            const isFull = e.class._count.enrollments >= e.class.capacity
            return (
              <li
                key={e.id}
                className="flex items-center justify-between rounded-lg border border-neutral-100 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                    {e.class.name}
                  </span>
                  <span className="text-xs text-neutral-500 capitalize">
                    {formatSchedule(e.class.schedule)} · {e.class.instructor.name}
                  </span>
                  <span className="text-xs text-neutral-400">
                    {e.class._count.enrollments}/{e.class.capacity} alumnas
                    {isFull && <span className="ml-1 text-amber-500">(llena)</span>}
                  </span>
                </div>
                <button
                  onClick={() => handleRemove(e.id)}
                  disabled={removingId === e.id}
                  className="ml-4 p-1.5 rounded text-neutral-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-40 transition-colors"
                  title="Quitar de la clase"
                >
                  <IconTrash size={15} />
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
