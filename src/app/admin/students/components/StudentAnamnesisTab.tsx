'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { IconHeartRateMonitor } from '@tabler/icons-react'

interface AnamnesisRecord {
  id: number
  name: string
  age: number | null
  contact: string | null
  weightKg: number | null
  heightM: number | null
  injuries: string | null
  chronicDiseases: string | null
  allergies: string | null
  medications: string | null
  surgeries: string | null
  activityDaysPerWeek: number | null
  activityType: string | null
  sessionDurationMinutes: number | null
  consentAccepted: boolean
  createdAt: string
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">{label}</span>
      <span className="text-sm text-neutral-900 dark:text-neutral-100">{value ?? <em className="text-neutral-400">—</em>}</span>
    </div>
  )
}

interface Props {
  studentId: number
}

export default function StudentAnamnesisTab({ studentId }: Props) {
  const [records, setRecords] = useState<AnamnesisRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState(0) // index into records

  const fetchRecords = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/anamnesis?studentId=${studentId}`, { credentials: 'include' })
      if (!res.ok) throw new Error(`Error ${res.status}`)
      const data: AnamnesisRecord[] = await res.json()
      setRecords(data)
      setSelected(0)
    } catch (e: any) {
      setError(String(e.message || e))
    } finally {
      setLoading(false)
    }
  }, [studentId])

  useEffect(() => { void fetchRecords() }, [fetchRecords])

  if (loading) return <p className="text-sm text-neutral-400">Cargando…</p>
  if (error) return <p className="text-sm text-red-500">{error}</p>
  if (records.length === 0) return (
    <div className="flex flex-col items-center gap-3 py-10 text-neutral-400">
      <IconHeartRateMonitor size={32} className="opacity-40" />
      <p className="text-sm">La alumna aún no ha completado su anamnesis.</p>
    </div>
  )

  const r = records[selected]

  return (
    <div className="space-y-5">
      {/* Version selector when there are multiple submissions */}
      {records.length > 1 && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-neutral-500">Versión:</span>
          <select
            value={selected}
            onChange={e => setSelected(Number(e.target.value))}
            className="rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/40"
          >
            {records.map((rec, i) => (
              <option key={rec.id} value={i}>
                {new Date(rec.createdAt).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })}
                {i === 0 ? ' (más reciente)' : ''}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Physical data */}
      <section className="rounded-xl border border-neutral-200 dark:border-neutral-700 p-4 space-y-4">
        <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">Datos físicos</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Field label="Edad" value={r.age ? `${r.age} años` : null} />
          <Field label="Peso" value={r.weightKg ? `${r.weightKg} kg` : null} />
          <Field label="Talla" value={r.heightM ? `${r.heightM} m` : null} />
          <Field
            label="IMC"
            value={r.weightKg && r.heightM ? (r.weightKg / (r.heightM * r.heightM)).toFixed(1) : null}
          />
        </div>
      </section>

      {/* Health background */}
      <section className="rounded-xl border border-neutral-200 dark:border-neutral-700 p-4 space-y-4">
        <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">Antecedentes de salud</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Lesiones previas" value={r.injuries} />
          <Field label="Enfermedades crónicas" value={r.chronicDiseases} />
          <Field label="Alergias" value={r.allergies} />
          <Field label="Medicamentos" value={r.medications} />
          <Field label="Cirugías" value={r.surgeries} />
        </div>
      </section>

      {/* Physical activity */}
      <section className="rounded-xl border border-neutral-200 dark:border-neutral-700 p-4 space-y-4">
        <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">Actividad física</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Días/semana de actividad" value={r.activityDaysPerWeek} />
          <Field label="Tipo de actividad" value={r.activityType} />
          <Field label="Duración de sesión (min)" value={r.sessionDurationMinutes} />
        </div>
      </section>

      <p className="text-xs text-neutral-400">
        Enviado el {new Date(r.createdAt).toLocaleDateString('es-CL', { day: '2-digit', month: 'long', year: 'numeric' })}
        {r.consentAccepted && ' · Consentimiento aceptado'}
      </p>
    </div>
  )
}
