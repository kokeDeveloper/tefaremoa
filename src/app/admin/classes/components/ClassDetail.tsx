'use client'
import React, { useCallback, useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import { IconTrash, IconUserPlus, IconX, IconScan } from '@tabler/icons-react'

type EnrolledStudent = {
  id: number
  name: string
  lastName: string | null
  email: string
  planStatus: string | null
}

type Enrollment = {
  id: number
  studentId: number
  student: EnrolledStudent
}

type ClassDetail = {
  id: number
  name: string
  schedule: string
  capacity: number
  instructor: { id: number; name: string; email: string; phone: string | null }
  enrollments: Enrollment[]
  _count: { enrollments: number }
}

type StudentSearchResult = {
  id: number
  name: string
  lastName: string | null
  email: string
}

interface Props {
  classId: number
  onClose: () => void
  onUpdated: () => void
}

export default function ClassDetail({ classId, onClose, onUpdated }: Props) {
  const [cls, setCls] = useState<ClassDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<StudentSearchResult[]>([])
  const [searching, setSearching] = useState(false)
  const [enrolling, setEnrolling] = useState<number | null>(null)
  const [removingId, setRemovingId] = useState<number | null>(null)
  const [enrollError, setEnrollError] = useState<string | null>(null)

  const fetchDetail = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/classes/${classId}`, { credentials: 'include' })
      if (!res.ok) throw new Error('Error al cargar la clase')
      const data = await res.json()
      setCls(data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [classId])

  useEffect(() => { fetchDetail() }, [fetchDetail])

  const handleSearch = async (q: string) => {
    setSearchQuery(q)
    if (q.trim().length < 2) { setSearchResults([]); return }
    setSearching(true)
    try {
      const res = await fetch(`/api/students?search=${encodeURIComponent(q)}&take=8`, { credentials: 'include' })
      const data = await res.json()
      setSearchResults(data.items || [])
    } catch { setSearchResults([]) }
    setSearching(false)
  }

  const handleEnroll = async (studentId: number) => {
    setEnrollError(null)
    setEnrolling(studentId)
    try {
      const res = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ studentId, classId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al inscribir')
      setSearchQuery('')
      setSearchResults([])
      await fetchDetail()
      onUpdated()
    } catch (e: any) {
      setEnrollError(e.message)
    } finally {
      setEnrolling(null)
    }
  }

  const handleRemove = async (enrollmentId: number) => {
    setRemovingId(enrollmentId)
    try {
      await fetch(`/api/enrollments/${enrollmentId}`, { method: 'DELETE', credentials: 'include' })
      await fetchDetail()
      onUpdated()
    } catch { /* ignore */ }
    setRemovingId(null)
  }

  const enrolledIds = new Set(cls?.enrollments.map((e) => e.studentId) ?? [])

  const scheduleLabel = cls
    ? new Date(cls.schedule).toLocaleString('es-PF', { weekday: 'long', hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })
    : ''

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 dark:border-neutral-700">
        <div>
          <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
            {cls?.name ?? 'Cargando…'}
          </h2>
          {cls && (
            <p className="text-sm text-neutral-500 capitalize">{scheduleLabel} · {cls.instructor.name}</p>
          )}
        </div>
        <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200">
          <IconX size={20} />
        </button>
      </div>

      {loading && (
        <div className="flex-1 flex items-center justify-center text-neutral-400 text-sm">Cargando…</div>
      )}
      {error && (
        <div className="flex-1 flex items-center justify-center text-red-500 text-sm">{error}</div>
      )}

      {!loading && cls && (
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-6">
          {/* Stats + Scanner link */}
          <div className="flex gap-4">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg px-4 py-3 flex-1 text-center">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Inscritas</p>
              <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400">{cls._count.enrollments}</p>
            </div>
            <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg px-4 py-3 flex-1 text-center">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Capacidad</p>
              <p className="text-xl font-bold text-neutral-700 dark:text-neutral-300">{cls.capacity}</p>
            </div>
            <div className={`rounded-lg px-4 py-3 flex-1 text-center ${cls._count.enrollments < cls.capacity ? 'bg-sky-50 dark:bg-sky-900/20' : 'bg-amber-50 dark:bg-amber-900/20'}`}>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Disponibles</p>
              <p className={`text-xl font-bold ${cls._count.enrollments < cls.capacity ? 'text-sky-700 dark:text-sky-400' : 'text-amber-600 dark:text-amber-400'}`}>
                {cls.capacity - cls._count.enrollments}
              </p>
            </div>
          </div>

          {/* Scanner link */}
          <a
            href={`/admin/scanner/${cls.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full rounded-lg border border-violet-500/40 bg-violet-500/10 py-2.5 text-sm font-medium text-violet-400 hover:bg-violet-500/20 transition-colors"
          >
            <IconScan size={16} /> Abrir escáner de asistencia
          </a>

          {/* Enroll Student */}
          <div>
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Inscribir alumna</p>
            <div className="relative">
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <IconUserPlus size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre o correo…"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-sm rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
              {searchResults.length > 0 && (
                <ul className="absolute z-10 mt-1 w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-600 rounded-md shadow-lg max-h-52 overflow-auto">
                  {searchResults.map((s) => {
                    const alreadyEnrolled = enrolledIds.has(s.id)
                    return (
                      <li key={s.id} className="flex items-center justify-between px-3 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                        <div>
                          <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                            {s.name} {s.lastName}
                          </p>
                          <p className="text-xs text-neutral-500">{s.email}</p>
                        </div>
                        {alreadyEnrolled ? (
                          <span className="text-xs text-neutral-400 italic">Ya inscrita</span>
                        ) : (
                          <Button
                            className="bg-emerald-600 text-white text-xs px-2 py-1 hover:bg-emerald-700 disabled:opacity-50"
                            onClick={() => handleEnroll(s.id)}
                            disabled={enrolling === s.id || cls._count.enrollments >= cls.capacity}
                          >
                            {enrolling === s.id ? '…' : 'Inscribir'}
                          </Button>
                        )}
                      </li>
                    )
                  })}
                </ul>
              )}
              {searching && <p className="text-xs text-neutral-400 mt-1">Buscando…</p>}
              {enrollError && <p className="text-xs text-red-500 mt-1">{enrollError}</p>}
            </div>
          </div>

          {/* Enrolled List */}
          <div>
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Alumnas inscritas ({cls.enrollments.length})
            </p>
            {cls.enrollments.length === 0 ? (
              <p className="text-sm text-neutral-400 italic">Sin alumnas inscritas aún.</p>
            ) : (
              <ul className="flex flex-col gap-1">
                {cls.enrollments.map((e) => (
                  <li
                    key={e.id}
                    className="flex items-center justify-between rounded-md px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700"
                  >
                    <div>
                      <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                        {e.student.name} {e.student.lastName}
                      </p>
                      <p className="text-xs text-neutral-500">{e.student.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {e.student.planStatus && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          e.student.planStatus === 'Active'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        }`}>
                          {e.student.planStatus}
                        </span>
                      )}
                      <button
                        onClick={() => handleRemove(e.id)}
                        disabled={removingId === e.id}
                        className="text-neutral-400 hover:text-red-500 disabled:opacity-40 transition-colors"
                        title="Quitar de la clase"
                      >
                        <IconTrash size={15} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
