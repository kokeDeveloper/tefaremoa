'use client'

import React from 'react'
import Link from 'next/link'
import { cn } from '@/util/cn'
import StudentAvatar from './StudentAvatar'

type PlanStatusFilter = 'all' | 'Active' | 'ExpiringSoon' | 'Expired' | 'NO_PLAN'

type Student = {
  id: number
  name: string
  lastName?: string | null
  email: string
  phone?: string | null
  planType?: string | null
  planStatus?: string | null
  _count?: { enrollments: number }
}

const PAGE_SIZE = 15

const statusFilters: { value: PlanStatusFilter; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'Active', label: 'Activas' },
  { value: 'ExpiringSoon', label: 'Por vencer' },
  { value: 'Expired', label: 'Vencidas' },
  { value: 'NO_PLAN', label: 'Sin plan' },
]

const statusStyle: Record<string, string> = {
  Active: 'bg-orange-600 text-white',
  ExpiringSoon: 'bg-amber-500 text-neutral-900',
  Expired: 'bg-red-600 text-white',
  NO_PLAN: 'bg-neutral-500 text-white',
}

const statusLabel: Record<string, string> = {
  Active: 'Activa',
  ExpiringSoon: 'Por vencer',
  Expired: 'Vencida',
  NO_PLAN: 'Sin plan',
}

export function AlumnasSection() {
  const [students, setStudents] = React.useState<Student[]>([])
  const [total, setTotal] = React.useState(0)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [search, setSearch] = React.useState('')
  const [page, setPage] = React.useState(1)
  const [statusFilter, setStatusFilter] = React.useState<PlanStatusFilter>('all')

  const fetchStudents = React.useCallback(
    async (opts?: { page?: number; search?: string; status?: PlanStatusFilter }) => {
      const targetPage = opts?.page ?? page
      const targetSearch = opts?.search ?? search
      const targetStatus = opts?.status ?? statusFilter

      setLoading(true)
      setError(null)
      try {
        const skip = (targetPage - 1) * PAGE_SIZE
        let url = `/api/students?skip=${skip}&take=${PAGE_SIZE}&search=${encodeURIComponent(targetSearch)}`
        if (targetStatus !== 'all') url += `&planStatus=${encodeURIComponent(targetStatus)}`

        const res = await fetch(url, { credentials: 'include' })
        if (!res.ok) throw new Error(`Error ${res.status}`)
        const data = await res.json()
        setStudents(data.items ?? [])
        setTotal(data.total ?? 0)
        setPage(targetPage)
        setSearch(targetSearch)
        setStatusFilter(targetStatus)
      } catch (e: any) {
        setError(String(e.message || e))
      } finally {
        setLoading(false)
      }
    },
    [page, search, statusFilter]
  )

  React.useEffect(() => {
    void fetchStudents({ page: 1 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    void fetchStudents({ page: 1 })
  }

  const handleStatusFilter = (status: PlanStatusFilter) => {
    void fetchStudents({ page: 1, status })
  }

  return (
    <div className="flex w-full flex-col gap-6 rounded-tl-2xl border border-neutral-200 bg-gray-50 p-4 md:p-8 dark:border-neutral-700 dark:bg-neutral-900 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">Alumnas</h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {total > 0 ? `${total} alumna${total !== 1 ? 's' : ''} registrada${total !== 1 ? 's' : ''}` : 'Directorio de alumnas'}
        </p>
      </div>

      {/* Search + status filters */}
      <div className="flex flex-col gap-3">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nombre o correo…"
            className="flex-1 rounded border border-neutral-300 bg-white px-3 py-2 text-sm transition focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/40 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100"
          />
          <button type="submit" className="btn-donate rounded px-4 py-2 text-sm font-semibold whitespace-nowrap">
            Buscar
          </button>
        </form>

        {/* Status filter pills */}
        <div className="flex flex-wrap gap-2">
          {statusFilters.map(f => (
            <button
              key={f.value}
              type="button"
              onClick={() => handleStatusFilter(f.value)}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-medium transition border',
                statusFilter === f.value
                  ? 'bg-orange-600 text-white border-orange-600'
                  : 'border-neutral-300 dark:border-neutral-600 text-neutral-600 dark:text-neutral-300 hover:border-orange-400 hover:text-orange-600'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Student grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-neutral-200 dark:bg-neutral-800" />
          ))}
        </div>
      ) : students.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 p-10 text-sm text-neutral-500 text-center">
          No se encontraron alumnas.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map(s => (
            <Link
              key={s.id}
              href={`/admin/students/${s.id}`}
              className="group flex items-start gap-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-950 p-4 hover:border-orange-400 hover:shadow-md transition-all"
            >
              <StudentAvatar studentId={s.id} name={s.name} lastName={s.lastName} size={40} />
              <div className="min-w-0 flex-1 space-y-1">
                <p className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 truncate group-hover:text-orange-600 transition-colors">
                  {s.name} {s.lastName ?? ''}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{s.email}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {s.planStatus && (
                    <span className={cn('rounded px-1.5 py-0.5 text-[10px] font-semibold', statusStyle[s.planStatus] ?? 'bg-neutral-400 text-white')}>
                      {statusLabel[s.planStatus] ?? s.planStatus}
                    </span>
                  )}
                  {s.planType && (
                    <span className="text-[10px] text-neutral-400">{s.planType}</span>
                  )}
                  {s._count !== undefined && s._count.enrollments > 0 && (
                    <span className="text-[10px] text-neutral-400">{s._count.enrollments} clase{s._count.enrollments !== 1 ? 's' : ''}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-500 dark:text-neutral-400">
            Página {page} de {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => void fetchStudents({ page: page - 1 })}
              disabled={page <= 1 || loading}
              className="rounded border border-neutral-300 dark:border-neutral-600 px-3 py-1 text-sm disabled:opacity-40 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
            >
              ← Anterior
            </button>
            <button
              type="button"
              onClick={() => void fetchStudents({ page: page + 1 })}
              disabled={page >= totalPages || loading}
              className="rounded border border-neutral-300 dark:border-neutral-600 px-3 py-1 text-sm disabled:opacity-40 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
            >
              Siguiente →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
