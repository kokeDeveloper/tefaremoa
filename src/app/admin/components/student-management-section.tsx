'use client'

import React from 'react'
import { cn } from '@/util/cn'
import StudentForm from '../students/components/StudentForm'
import StudentBulkUpload from '../students/components/StudentBulkUpload'
import PlanAlertsPanel, { PlanAlertsResponse } from '../students/components/PlanAlertsPanel'

export interface StudentManagementSectionProps {
  variant?: 'dashboard' | 'page'
  id?: string
}

export function StudentManagementSection({ variant = 'dashboard', id }: StudentManagementSectionProps) {
  const [inscriptionTab, setInscriptionTab] = React.useState<'individual' | 'bulk'>('individual')
  const [alerts, setAlerts] = React.useState<PlanAlertsResponse | null>(null)
  const [alertsLoading, setAlertsLoading] = React.useState(false)
  const [alertsError, setAlertsError] = React.useState<string | null>(null)
  const [alertThreshold, setAlertThreshold] = React.useState(7)
  const [includeNoPlan, setIncludeNoPlan] = React.useState(true)

  const fetchAlerts = React.useCallback(
    async (options?: { thresholdDays?: number; includeNoPlan?: boolean }) => {
      const threshold = options?.thresholdDays ?? alertThreshold
      const include = options?.includeNoPlan ?? includeNoPlan

      setAlertsLoading(true)
      setAlertsError(null)
      try {
        if (options?.thresholdDays !== undefined) setAlertThreshold(options.thresholdDays)
        if (options?.includeNoPlan !== undefined) setIncludeNoPlan(options.includeNoPlan)

        const res = await fetch(`/api/alerts/plan-expiring?days=${threshold}&includeNoPlan=${include}`, {
          credentials: 'include',
        })
        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: res.statusText }))
          throw new Error(err.error || `Error ${res.status}`)
        }
        setAlerts(await res.json())
      } catch (err: any) {
        setAlertsError(String(err.message || err))
      }
      setAlertsLoading(false)
    },
    [alertThreshold, includeNoPlan]
  )

  React.useEffect(() => {
    void fetchAlerts({ thresholdDays: alertThreshold, includeNoPlan })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const innerClassName = variant === 'page'
    ? 'flex w-full flex-col gap-8 rounded-tl-2xl border border-neutral-200 bg-gray-50 p-4 md:p-10 dark:border-neutral-700 dark:bg-neutral-900'
    : 'flex flex-col gap-8 p-5'

  const headingClassName = variant === 'page'
    ? 'text-2xl font-semibold text-neutral-900 dark:text-neutral-50'
    : 'text-xl font-semibold text-neutral-900 dark:text-neutral-50'

  return (
    <div className={cn('w-full overflow-y-auto', variant !== 'page' && 'rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-900')} id={id}>
      <div className={innerClassName}>

        {/* Header */}
        <div className="flex flex-col gap-1">
          <h2 className={headingClassName}>Inscripción</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Registra nuevas alumnas y gestiona alertas de vencimiento de plan.
          </p>
        </div>

        {/* Registration form */}
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 shadow-sm dark:border-neutral-700 dark:bg-neutral-950 space-y-4">
          <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
            Nueva alumna
          </h3>

          {/* Tab switcher */}
          <div className="flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800">
            <button
              type="button"
              onClick={() => setInscriptionTab('individual')}
              className={cn(
                'flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition',
                inscriptionTab === 'individual'
                  ? 'bg-white text-neutral-900 shadow dark:bg-neutral-700 dark:text-neutral-100'
                  : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'
              )}
            >
              Registro individual
            </button>
            <button
              type="button"
              onClick={() => setInscriptionTab('bulk')}
              className={cn(
                'flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition',
                inscriptionTab === 'bulk'
                  ? 'bg-white text-neutral-900 shadow dark:bg-neutral-700 dark:text-neutral-100'
                  : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'
              )}
            >
              Carga masiva CSV
            </button>
          </div>

          {inscriptionTab === 'individual' ? (
            <StudentForm
              variant="embedded"
              onSaved={() => void fetchAlerts()}
            />
          ) : (
            <StudentBulkUpload
              onUploaded={() => void fetchAlerts()}
            />
          )}
        </div>

        {/* Plan expiry alerts */}
        <PlanAlertsPanel
          data={alerts}
          loading={alertsLoading}
          error={alertsError}
          onRefresh={() => void fetchAlerts()}
          thresholdDays={alertThreshold}
          includeNoPlan={includeNoPlan}
          onOptionsChange={(options) => void fetchAlerts(options)}
        />

      </div>
    </div>
  )
}

export default StudentManagementSection

