'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { IconScan, IconUsers, IconRefresh } from '@tabler/icons-react'
import { cn } from '@/util/cn'

type ClassRecord = {
  id: number
  name: string
  schedule: string
  capacity: number
  instructor: { id: number; name: string } | null
  _count: { enrollments: number }
}

export function AttendanceSection() {
  const [classes, setClasses] = useState<ClassRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadClasses = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/classes', { credentials: 'include' })
      if (!res.ok) throw new Error('Error al cargar las clases')
      const data = await res.json()
      setClasses(data)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadClasses() }, [loadClasses])

  return (
    <div className="w-full overflow-y-auto">
      <div className="flex w-full flex-col gap-6 rounded-tl-2xl border border-neutral-200 bg-gray-50 p-4 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-tight text-neutral-500 dark:text-neutral-400">
              Control de asistencia
            </p>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              Selecciona una clase
            </h2>
          </div>
          <button
            onClick={loadClasses}
            disabled={loading}
            className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100 transition dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            <IconRefresh className={cn('h-4 w-4', loading && 'animate-spin')} />
            Actualizar
          </button>
        </header>

        {error && (
          <div className="rounded-lg border border-rose-500/50 bg-rose-100/50 p-4 text-sm text-rose-700 dark:border-rose-500/40 dark:bg-rose-900/20 dark:text-rose-200">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-xl border border-neutral-200 bg-white h-40 dark:border-neutral-700 dark:bg-neutral-900/80" />
            ))}
          </div>
        ) : classes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-neutral-400">
            <IconUsers size={40} className="mb-3 opacity-30" />
            <p className="text-sm">No hay clases registradas.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {classes.map((cls) => {
              const enrolled = cls._count?.enrollments ?? 0
              const isFull = enrolled >= cls.capacity
              const scheduleDate = new Date(cls.schedule)
              const scheduleLabel = scheduleDate.toLocaleString('es-CL', {
                weekday: 'long',
                hour: '2-digit',
                minute: '2-digit',
              })
              return (
                <article
                  key={cls.id}
                  className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm hover:shadow-md transition dark:border-neutral-700 dark:bg-neutral-900/80 border-l-4 border-l-orange-500/70"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{cls.name}</h3>
                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400 capitalize">{scheduleLabel}</p>
                    {cls.instructor && (
                      <p className="mt-0.5 text-xs text-neutral-400 dark:text-neutral-500">{cls.instructor.name}</p>
                    )}
                    <p className="mt-2 text-xs">
                      <span className={cn('font-semibold', isFull ? 'text-amber-600 dark:text-amber-400' : 'text-orange-600 dark:text-orange-400')}>
                        {enrolled}
                      </span>
                      <span className="text-neutral-400"> / {cls.capacity} inscritas</span>
                    </p>
                  </div>
                  <a
                    href={`/admin/scanner/${cls.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium px-4 py-2 transition-colors"
                  >
                    <IconScan size={16} />
                    Pasar lista
                  </a>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
