'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { IconCirclePlus, IconCurrencyDollar, IconCalendar } from '@tabler/icons-react'

interface Payment {
  id: number
  amount: number
  date: string
}

interface Props {
  studentId: number
  planType?: string
  planStartDate?: string | null
  planEndDate?: string | null
  planStatus?: string
}

function formatCLP(amount: number) {
  return amount.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 })
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })
}

const planStatusLabel: Record<string, { label: string; color: string }> = {
  Active: { label: 'Activo', color: 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400' },
  ExpiringSoon: { label: 'Por vencer', color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400' },
  Expired: { label: 'Vencido', color: 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400' },
  NO_PLAN: { label: 'Sin plan', color: 'text-neutral-500 bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-400' },
}

export default function StudentFinancesTab({ studentId, planType, planStartDate, planEndDate, planStatus }: Props) {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // New payment form
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const fetchPayments = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/payments?studentId=${studentId}`, { credentials: 'include' })
      if (!res.ok) throw new Error(`Error ${res.status}`)
      const data = await res.json()
      setPayments(data)
    } catch (e: any) {
      setError(String(e.message || e))
    } finally {
      setLoading(false)
    }
  }, [studentId])

  useEffect(() => { void fetchPayments() }, [fetchPayments])

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    const amountNum = parseFloat(amount.replace(',', '.'))
    if (!amountNum || amountNum <= 0) { setSaveError('Monto inválido'); return }
    setSaving(true)
    setSaveError(null)
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, amount: amountNum, date }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || `Error ${res.status}`)
      }
      setAmount('')
      setDate(new Date().toISOString().slice(0, 10))
      void fetchPayments()
    } catch (e: any) {
      setSaveError(String(e.message || e))
    } finally {
      setSaving(false)
    }
  }

  const statusInfo = planStatusLabel[planStatus ?? 'NO_PLAN'] ?? planStatusLabel.NO_PLAN
  const total = payments.reduce((s, p) => s + p.amount, 0)

  return (
    <div className="space-y-6">
      {/* Plan summary */}
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-700 p-4 space-y-3">
        <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">Plan activo</h3>
        <div className="flex flex-wrap gap-3 text-sm">
          <span className="text-neutral-500 dark:text-neutral-400">Tipo:</span>
          <span className="font-medium text-neutral-900 dark:text-neutral-100">{planType ?? '—'}</span>
          <span className={`ml-2 rounded-full px-2 py-0.5 text-xs font-medium ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
        </div>
        {(planStartDate || planEndDate) && (
          <div className="flex flex-wrap gap-4 text-sm text-neutral-500 dark:text-neutral-400">
            {planStartDate && (
              <span className="flex items-center gap-1">
                <IconCalendar size={14} /> Inicio: {formatDate(planStartDate)}
              </span>
            )}
            {planEndDate && (
              <span className="flex items-center gap-1">
                <IconCalendar size={14} /> Fin: {formatDate(planEndDate)}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Add payment form */}
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-700 p-4 space-y-3">
        <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">Registrar pago</h3>
        <form onSubmit={handleAddPayment} className="flex flex-wrap gap-3 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-neutral-500">Monto (CLP)</label>
            <input
              type="number"
              min="1"
              step="1"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="Ej: 35000"
              className="rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-3 py-1.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/40 w-36"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-neutral-500">Fecha</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-3 py-1.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/40"
              required
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="btn-donate flex items-center gap-1.5 rounded px-4 py-1.5 text-sm font-semibold disabled:opacity-60"
          >
            <IconCirclePlus size={16} />
            {saving ? 'Guardando…' : 'Registrar'}
          </button>
        </form>
        {saveError && <p className="text-xs text-red-500">{saveError}</p>}
      </div>

      {/* Payment history */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">
            Historial de pagos
          </h3>
          {payments.length > 0 && (
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              Total: <span className="font-semibold text-neutral-900 dark:text-neutral-100">{formatCLP(total)}</span>
            </span>
          )}
        </div>
        {loading && <p className="text-sm text-neutral-400">Cargando…</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}
        {!loading && payments.length === 0 && (
          <p className="text-sm text-neutral-400 dark:text-neutral-500">Sin pagos registrados.</p>
        )}
        {payments.length > 0 && (
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
            {payments.map(p => (
              <div key={p.id} className="flex items-center justify-between px-4 py-3 bg-white dark:bg-neutral-900 text-sm">
                <span className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
                  <IconCalendar size={14} /> {formatDate(p.date)}
                </span>
                <span className="flex items-center gap-1 font-semibold text-neutral-900 dark:text-neutral-100">
                  <IconCurrencyDollar size={14} className="text-green-600" />
                  {formatCLP(p.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
