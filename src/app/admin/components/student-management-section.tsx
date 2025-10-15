'use client'

import React from 'react'
import { cn } from '@/util/cn'
import StudentForm from '../students/components/StudentForm'
import StudentList from '../students/components/StudentList'
import PlanAlertsPanel, { PlanAlertsResponse } from '../students/components/PlanAlertsPanel'

export interface StudentManagementSectionProps {
  variant?: 'dashboard' | 'page'
  id?: string
}

const PAGE_SIZE = 10

export function StudentManagementSection({ variant = 'dashboard', id }: StudentManagementSectionProps) {
  const [students, setStudents] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [total, setTotal] = React.useState(0)

  const [search, setSearch] = React.useState('')
  const [page, setPage] = React.useState(1)
  const [alerts, setAlerts] = React.useState<PlanAlertsResponse | null>(null)
  const [alertsLoading, setAlertsLoading] = React.useState(false)
  const [alertsError, setAlertsError] = React.useState<string | null>(null)
  const [alertThreshold, setAlertThreshold] = React.useState(7)
  const [includeNoPlan, setIncludeNoPlan] = React.useState(true)

  const fetchStudents = React.useCallback(
    async (options?: { page?: number; search?: string }) => {
      const targetPage = options?.page ?? page
      const targetSearch = options?.search ?? search

      setLoading(true)
      setError(null)
      try {
        const q = `?skip=${(targetPage - 1) * PAGE_SIZE}&take=${PAGE_SIZE}&search=${encodeURIComponent(targetSearch)}`
        const res = await fetch('/api/students' + q, {
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        })
        if (!res.ok) {
          const data = await res.json().catch(() => ({ error: res.statusText }))
          throw new Error(data.error || `Error ${res.status}`)
        }
        const data = await res.json()
        setStudents(data.items || [])
        setTotal(data.total || 0)
        setPage(targetPage)
        setSearch(targetSearch)
      } catch (err: any) {
        console.error(err)
        setError(String(err.message || err))
      }
      setLoading(false)
    },
    [page, search]
  )

  const fetchAlerts = React.useCallback(
    async (options?: { thresholdDays?: number; includeNoPlan?: boolean }) => {
      const threshold = options?.thresholdDays ?? alertThreshold
      const include = options?.includeNoPlan ?? includeNoPlan

      setAlertsLoading(true)
      setAlertsError(null)
      try {
        if (options?.thresholdDays !== undefined) {
          setAlertThreshold(options.thresholdDays)
        }
        if (options?.includeNoPlan !== undefined) {
          setIncludeNoPlan(options.includeNoPlan)
        }

        const res = await fetch(`/api/alerts/plan-expiring?days=${threshold}&includeNoPlan=${include}`, {
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        })
        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: res.statusText }))
          throw new Error(err.error || `Error ${res.status}`)
        }
        const data: PlanAlertsResponse = await res.json()
        setAlerts(data)
      } catch (err: any) {
        console.error(err)
        setAlertsError(String(err.message || err))
      }
      setAlertsLoading(false)
    },
    [alertThreshold, includeNoPlan]
  )

  React.useEffect(() => {
    void fetchStudents({ page, search })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    void fetchAlerts({ thresholdDays: alertThreshold, includeNoPlan })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const outerClassName = variant === 'page'
    ? 'w-full overflow-y-auto'
    : 'rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-900'

  const innerClassName = variant === 'page'
    ? 'flex w-full flex-col gap-6 rounded-tl-2xl border border-neutral-200 bg-gray-50 p-4 md:p-10 dark:border-neutral-700 dark:bg-neutral-900'
    : 'flex flex-col gap-6 p-5'

  const headingClassName = variant === 'page'
    ? 'text-2xl font-semibold text-neutral-900 dark:text-neutral-50'
    : 'text-xl font-semibold text-neutral-900 dark:text-neutral-50'

  return (
  <div className={cn(outerClassName, 'w-full')} id={id}>
      <div className={innerClassName}>
        <div className="flex flex-col gap-2">
          <h2 className={headingClassName}>Administración de alumnas</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Gestiona altas, renovaciones y seguimiento desde un solo lugar.
          </p>
        </div>

        <div className={cn('flex flex-col gap-4', variant === 'page' ? 'mb-2' : '')}>
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="flex w-full flex-col gap-2 lg:flex-1 lg:max-w-lg">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                Buscar por nombre o correo
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar por nombre o email"
                  className="flex-1 rounded border border-neutral-300 bg-white px-3 py-2 text-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100"
                />
                <button
                  type="button"
                  onClick={() => {
                    void fetchStudents({ page: 1 })
                    void fetchAlerts()
                  }}
                  className="btn-donate whitespace-nowrap rounded px-4 py-2 text-sm font-semibold"
                >
                  Buscar
                </button>
              </div>
            </div>
            <div className="xl:flex-1">
              <StudentForm
                variant={variant === 'dashboard' ? 'embedded' : 'standalone'}
                onSaved={() => {
                  void fetchStudents({ page: 1 })
                  void fetchAlerts()
                }}
              />
            </div>
          </div>
        </div>

        <PlanAlertsPanel
          data={alerts}
          loading={alertsLoading}
          error={alertsError}
          onRefresh={() => void fetchAlerts()}
          thresholdDays={alertThreshold}
          includeNoPlan={includeNoPlan}
          onOptionsChange={(options) => void fetchAlerts(options)}
        />

        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="text-sm text-neutral-500">Cargando...</div>
          ) : (
            <>
              {error && (
                <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 dark:border-red-800/60 dark:bg-red-950/60 dark:text-red-300">
                  {error}
                </div>
              )}
              <StudentList
                students={students}
                onDeleted={() => {
                  void fetchStudents({ page: Math.min(page, Math.max(1, Math.ceil((total - 1) / PAGE_SIZE) || 1)) })
                  void fetchAlerts()
                }}
              />
              <div className="mt-6 flex flex-col gap-3 text-sm md:flex-row md:items-center md:justify-between">
                <div className="text-neutral-500">
                  {total > 0
                    ? `Mostrando ${(page - 1) * PAGE_SIZE + 1} - ${Math.min(page * PAGE_SIZE, total)} de ${total}`
                    : 'Sin alumnas registradas'}
                </div>
                <div className="flex gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => {
                      if (page > 1) {
                        void fetchStudents({ page: page - 1 })
                      }
                    }}
                    className="rounded border border-neutral-300 px-3 py-1 text-sm disabled:opacity-50 dark:border-neutral-600"
                  >
                    Anterior
                  </button>
                  <button
                    disabled={page * PAGE_SIZE >= total}
                    onClick={() => {
                      if (page * PAGE_SIZE < total) {
                        void fetchStudents({ page: page + 1 })
                      }
                    }}
                    className="rounded border border-neutral-300 px-3 py-1 text-sm disabled:opacity-50 dark:border-neutral-600"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default StudentManagementSection
