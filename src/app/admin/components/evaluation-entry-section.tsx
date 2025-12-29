'use client'

import React from 'react'
import { cn } from '@/util/cn'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

type Level = 'Por iniciar' | 'En proceso' | 'Logrado'

type SequenceKey =
  | 'part1_brain'
  | 'part1_directions'
  | 'part1_rhythm'
  | 'part2_brain'
  | 'part2_directions'
  | 'part2_rhythm'
  | 'part3_brain'
  | 'part3_directions'
  | 'part3_rhythm'

type ChoreoKey = 'rhythm' | 'basePosture' | 'basicSteps' | 'interpretation' | 'manaPresence'

type StudentLite = {
  id: number
  name: string
  lastName: string
  email: string
}

type DanceEvaluationLite = {
  id: number
  studentId: number
  evaluationDate: string
  modality: 'INDIVIDUAL' | 'PAIR'
  partnerName: string | null
  rubricSequences: Record<SequenceKey, Level>
  rubricChoreo: Record<ChoreoKey, Level>
  observations: string | null
}

const LEVELS: Level[] = ['Por iniciar', 'En proceso', 'Logrado']

const SEQUENCE_PARTS: Array<{
  title: string
  items: Array<{ key: SequenceKey; label: string }>
}> = [
  {
    title: 'Parte 1',
    items: [
      { key: 'part1_brain', label: 'Entrenar con el cerebro' },
      { key: 'part1_directions', label: 'Bailarla en diferentes direcciones' },
      { key: 'part1_rhythm', label: 'Bailarla con diferentes ritmos' },
    ],
  },
  {
    title: 'Parte 2',
    items: [
      { key: 'part2_brain', label: 'Entrenar con el cerebro' },
      { key: 'part2_directions', label: 'Bailarla en diferentes direcciones' },
      { key: 'part2_rhythm', label: 'Bailarla con diferentes ritmos' },
    ],
  },
  {
    title: 'Parte 3',
    items: [
      { key: 'part3_brain', label: 'Entrenar con el cerebro' },
      { key: 'part3_directions', label: 'Bailarla en diferentes direcciones' },
      { key: 'part3_rhythm', label: 'Bailarla con diferentes ritmos' },
    ],
  },
]

const CHOREO_ITEMS: Array<{ key: ChoreoKey; label: string }> = [
  { key: 'rhythm', label: 'Ritmo' },
  { key: 'basePosture', label: 'Postura base' },
  { key: 'basicSteps', label: 'Pasos básicos' },
  { key: 'interpretation', label: 'Interpretación' },
  { key: 'manaPresence', label: 'Mana / Presencia escénica' },
]

function todayInputValue() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function toInputDate(value?: string | Date | null): string {
  if (!value) return ''
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().split('T')[0]
}

function createEmptyRubric<T extends string>(keys: readonly T[]) {
  return keys.reduce((acc, key) => {
    acc[key] = ''
    return acc
  }, {} as Record<T, '' | Level>)
}

function countCompleted<T extends string>(rubric: Record<T, '' | Level>, keys: readonly T[]) {
  return keys.reduce((acc, key) => (rubric[key] ? acc + 1 : acc), 0)
}

function RubricMatrix({
  title,
  subtitle,
  items,
  values,
  onChange,
  namePrefix,
}: {
  title: string
  subtitle?: string
  items: Array<{ key: string; label: string }>
  values: Record<string, '' | Level>
  onChange: (key: string, value: Level) => void
  namePrefix: string
}) {
  const keys = React.useMemo(() => items.map((x) => x.key), [items])
  const completed = React.useMemo(() => countCompleted(values, keys), [values, keys])

  return (
    <section className="grid gap-3 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-700 dark:bg-neutral-950">
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h4 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">{title}</h4>
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            {completed}/{items.length} completado
          </div>
        </div>
        {subtitle && <p className="text-sm text-neutral-500 dark:text-neutral-400">{subtitle}</p>}
      </div>

      <div className="overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-neutral-50 dark:bg-neutral-900">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-neutral-700 dark:text-neutral-200">Criterio</th>
              {LEVELS.map((level) => (
                <th key={level} className="px-3 py-2 text-center font-medium text-neutral-700 dark:text-neutral-200">
                  {level}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.key} className="border-t border-neutral-200 dark:border-neutral-800">
                <td className="px-3 py-3 text-neutral-900 dark:text-neutral-100">{item.label}</td>
                {LEVELS.map((level) => {
                  const checked = values[item.key] === level
                  return (
                    <td key={level} className="px-3 py-2">
                      <label
                        className={cn(
                          'flex cursor-pointer items-center justify-center rounded-md border px-2 py-2 transition',
                          checked
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40'
                            : 'border-neutral-200 bg-white hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-950 dark:hover:bg-neutral-900'
                        )}
                      >
                        <input
                          className="h-4 w-4"
                          type="radio"
                          name={`${namePrefix}-${item.key}`}
                          value={level}
                          checked={checked}
                          onChange={() => onChange(item.key, level)}
                          aria-label={`${item.label}: ${level}`}
                        />
                      </label>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-xs text-neutral-500 dark:text-neutral-400">Marca exactamente un nivel por criterio.</div>
    </section>
  )
}

export function EvaluationEntrySection() {
  const [studentSearch, setStudentSearch] = React.useState('')
  const [students, setStudents] = React.useState<StudentLite[]>([])
  const [studentLoading, setStudentLoading] = React.useState(false)
  const [studentError, setStudentError] = React.useState<string | null>(null)
  const [selectedStudent, setSelectedStudent] = React.useState<StudentLite | null>(null)

  const [evaluationDate, setEvaluationDate] = React.useState<string>(() => todayInputValue())
  const [modality, setModality] = React.useState<'INDIVIDUAL' | 'PAIR'>('INDIVIDUAL')
  const [partnerName, setPartnerName] = React.useState('')

  const [rubricSequences, setRubricSequences] = React.useState(() => {
    const keys = SEQUENCE_PARTS.flatMap((p) => p.items.map((x) => x.key)) as SequenceKey[]
    return createEmptyRubric(keys)
  })
  const [rubricChoreo, setRubricChoreo] = React.useState(() =>
    createEmptyRubric(CHOREO_ITEMS.map((x) => x.key) as ChoreoKey[])
  )
  const [observations, setObservations] = React.useState('')

  const [saving, setSaving] = React.useState(false)
  const [saveError, setSaveError] = React.useState<string | null>(null)
  const [saveMessage, setSaveMessage] = React.useState<string | null>(null)

  const [evaluations, setEvaluations] = React.useState<DanceEvaluationLite[]>([])
  const [evalLoading, setEvalLoading] = React.useState(false)
  const [evalError, setEvalError] = React.useState<string | null>(null)
  const [editingEvaluationId, setEditingEvaluationId] = React.useState<number | null>(null)

  const loadStudents = React.useCallback(async (search: string) => {
    setStudentLoading(true)
    setStudentError(null)

    try {
      const q = `?skip=0&take=10&search=${encodeURIComponent(search)}`
      const res = await fetch('/api/students' + q, { credentials: 'include' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data?.error || 'No se pudieron cargar las alumnas.')
      }

      const items: any[] = Array.isArray(data?.items) ? data.items : []
      const lite: StudentLite[] = items.map((item) => ({
        id: Number(item.id),
        name: String(item.name || ''),
        lastName: String(item.lastName || ''),
        email: String(item.email || ''),
      }))

      setStudents(lite)
    } catch (err: any) {
      setStudentError(err?.message || 'Error al cargar alumnas')
      setStudents([])
    } finally {
      setStudentLoading(false)
    }
  }, [])

  React.useEffect(() => {
    void loadStudents('')
  }, [loadStudents])

  const loadEvaluations = React.useCallback(async (studentId: number) => {
    setEvalLoading(true)
    setEvalError(null)
    try {
      const res = await fetch(`/api/evaluations?studentId=${studentId}`, { credentials: 'include' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data?.error || 'No se pudieron cargar las evaluaciones.')
      }

      const items: any[] = Array.isArray(data?.items) ? data.items : []
      const normalized: DanceEvaluationLite[] = items
        .map((item) => {
          const id = Number(item?.id)
          const sid = Number(item?.studentId)
          if (!Number.isFinite(id) || !Number.isFinite(sid)) return null
          return {
            id,
            studentId: sid,
            evaluationDate: String(item?.evaluationDate || ''),
            modality: item?.modality === 'PAIR' ? 'PAIR' : 'INDIVIDUAL',
            partnerName: item?.partnerName ? String(item.partnerName) : null,
            rubricSequences: (item?.rubricSequences || {}) as any,
            rubricChoreo: (item?.rubricChoreo || {}) as any,
            observations: item?.observations ? String(item.observations) : null,
          } as DanceEvaluationLite
        })
        .filter(Boolean) as DanceEvaluationLite[]

      setEvaluations(normalized)
    } catch (err: any) {
      setEvalError(err?.message || 'Error al cargar evaluaciones')
      setEvaluations([])
    } finally {
      setEvalLoading(false)
    }
  }, [])

  React.useEffect(() => {
    if (!selectedStudent?.id) {
      setEvaluations([])
      setEvalError(null)
      setEditingEvaluationId(null)
      return
    }
    void loadEvaluations(selectedStudent.id)
  }, [selectedStudent?.id, loadEvaluations])

  const sequenceKeys = React.useMemo(
    () => SEQUENCE_PARTS.flatMap((p) => p.items.map((x) => x.key)) as SequenceKey[],
    []
  )
  const choreoKeys = React.useMemo(() => CHOREO_ITEMS.map((x) => x.key), [])

  const validateBeforeSave = (): string | null => {
    if (!selectedStudent) return 'Selecciona una alumna.'
    if (!evaluationDate) return 'Selecciona una fecha.'
    if (modality === 'PAIR' && !partnerName.trim()) return 'Ingresa el nombre de la pareja.'

    for (const key of sequenceKeys) {
      if (!rubricSequences[key]) return 'Completa la rúbrica de secuencias.'
    }
    for (const key of choreoKeys) {
      if (!rubricChoreo[key]) return 'Completa la rúbrica de coreografía.'
    }

    return null
  }

  const save = async (event: React.FormEvent) => {
    event.preventDefault()
    setSaveError(null)
    setSaveMessage(null)

    const validationError = validateBeforeSave()
    if (validationError) {
      setSaveError(validationError)
      return
    }

    setSaving(true)
    try {
      const isEditing = typeof editingEvaluationId === 'number'
      const url = isEditing ? `/api/evaluations/${editingEvaluationId}` : '/api/evaluations'
      const method = isEditing ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          studentId: selectedStudent!.id,
          evaluationDate,
          modality,
          partnerName: modality === 'PAIR' ? partnerName.trim() : null,
          rubricSequences,
          rubricChoreo,
          observations,
        }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data?.error || 'No se pudo guardar la evaluación.')
      }

      setSaveMessage(isEditing ? 'Evaluación actualizada correctamente.' : 'Evaluación guardada correctamente.')
      if (selectedStudent?.id) {
        void loadEvaluations(selectedStudent.id)
      }
    } catch (err: any) {
      setSaveError(err?.message || 'No se pudo guardar la evaluación.')
    } finally {
      setSaving(false)
    }
  }

  const startNewEvaluation = () => {
    setEditingEvaluationId(null)
    setEvaluationDate(todayInputValue())
    setModality('INDIVIDUAL')
    setPartnerName('')
    setRubricSequences(() => {
      const keys = SEQUENCE_PARTS.flatMap((p) => p.items.map((x) => x.key)) as SequenceKey[]
      return createEmptyRubric(keys)
    })
    setRubricChoreo(() => createEmptyRubric(CHOREO_ITEMS.map((x) => x.key) as ChoreoKey[]))
    setObservations('')
    setSaveError(null)
    setSaveMessage(null)
  }

  const editEvaluation = (evaluation: DanceEvaluationLite) => {
    setEditingEvaluationId(evaluation.id)
    setEvaluationDate(toInputDate(evaluation.evaluationDate))
    setModality(evaluation.modality)
    setPartnerName(evaluation.partnerName || '')

    setRubricSequences(() => {
      const keys = SEQUENCE_PARTS.flatMap((p) => p.items.map((x) => x.key)) as SequenceKey[]
      const empty = createEmptyRubric(keys)
      for (const key of keys) {
        const value = (evaluation.rubricSequences as any)?.[key]
        if (value === 'Por iniciar' || value === 'En proceso' || value === 'Logrado') {
          empty[key] = value
        }
      }
      return empty
    })

    setRubricChoreo(() => {
      const keys = CHOREO_ITEMS.map((x) => x.key) as ChoreoKey[]
      const empty = createEmptyRubric(keys)
      for (const key of keys) {
        const value = (evaluation.rubricChoreo as any)?.[key]
        if (value === 'Por iniciar' || value === 'En proceso' || value === 'Logrado') {
          empty[key] = value
        }
      }
      return empty
    })

    setObservations(evaluation.observations || '')
    setSaveError(null)
    setSaveMessage(null)
  }

  return (
    <div className="w-full overflow-y-auto">
      <div className="flex w-full flex-col gap-6 rounded-tl-2xl border border-neutral-200 bg-gray-50 p-4 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">Evaluaciones (’ote’a)</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Registra la rúbrica por alumna y por fecha.
          </p>
        </div>

        <section className="grid gap-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-700 dark:bg-neutral-950">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Seleccionar alumna</h3>

          <div className="grid gap-3 lg:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200">Buscar</label>
              <div className="mt-1 flex gap-2">
                <Input
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="Nombre, apellido o email"
                />
                <Button
                  type="button"
                  onClick={() => void loadStudents(studentSearch)}
                  disabled={studentLoading}
                >
                  {studentLoading ? 'Buscando…' : 'Buscar'}
                </Button>
              </div>
              {studentError && (
                <div className="mt-2 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800/60 dark:bg-red-950/60 dark:text-red-300">
                  {studentError}
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200">Alumna</label>
              <select
                className="mt-1 w-full rounded border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
                value={selectedStudent?.id ?? ''}
                onChange={(e) => {
                  const id = Number(e.target.value)
                  const found = students.find((s) => s.id === id) || null
                  setSelectedStudent(found)
                  setSaveError(null)
                  setSaveMessage(null)
                  setEditingEvaluationId(null)
                }}
              >
                <option value="">Selecciona…</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} {s.lastName} — {s.email}
                  </option>
                ))}
              </select>
              {selectedStudent && (
                <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                  Seleccionada: <span className="font-medium">{selectedStudent.name} {selectedStudent.lastName}</span>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="grid gap-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-700 dark:bg-neutral-950">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Evaluaciones registradas</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {selectedStudent
                  ? 'Selecciona una evaluación para editarla.'
                  : 'Selecciona una alumna para ver sus evaluaciones.'}
              </p>
            </div>
            <Button type="button" onClick={startNewEvaluation} disabled={!selectedStudent}>
              Nueva evaluación
            </Button>
          </div>

          {evalError && (
            <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800/60 dark:bg-red-950/60 dark:text-red-300">
              {evalError}
            </div>
          )}

          {!selectedStudent ? (
            <div className="text-sm text-neutral-500 dark:text-neutral-400">Sin alumna seleccionada.</div>
          ) : evalLoading ? (
            <div className="text-sm text-neutral-500 dark:text-neutral-400">Cargando evaluaciones…</div>
          ) : evaluations.length === 0 ? (
            <div className="text-sm text-neutral-500 dark:text-neutral-400">Aún no hay evaluaciones para esta alumna.</div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800">
              <table className="w-full border-collapse text-sm">
                <thead className="bg-neutral-50 dark:bg-neutral-900">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-neutral-700 dark:text-neutral-200">Fecha</th>
                    <th className="px-3 py-2 text-left font-medium text-neutral-700 dark:text-neutral-200">Modalidad</th>
                    <th className="px-3 py-2 text-right font-medium text-neutral-700 dark:text-neutral-200">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {evaluations.map((ev) => {
                    const dateLabel = toInputDate(ev.evaluationDate)
                    const isEditing = editingEvaluationId === ev.id
                    const modalityLabel =
                      ev.modality === 'PAIR' ? `Pareja${ev.partnerName ? ` (${ev.partnerName})` : ''}` : 'Individual'
                    return (
                      <tr key={ev.id} className="border-t border-neutral-200 dark:border-neutral-800">
                        <td className="px-3 py-3 text-neutral-900 dark:text-neutral-100">{dateLabel || '—'}</td>
                        <td className="px-3 py-3 text-neutral-700 dark:text-neutral-200">{modalityLabel}</td>
                        <td className="px-3 py-2 text-right">
                          <Button type="button" onClick={() => editEvaluation(ev)} disabled={isEditing}>
                            {isEditing ? 'Editando…' : 'Editar'}
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <form onSubmit={save} className="grid gap-6">
          {editingEvaluationId !== null && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-900 dark:text-emerald-100">
              Editando evaluación (ID #{editingEvaluationId}). Puedes modificar y guardar.
            </div>
          )}
          <section className="grid gap-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-700 dark:bg-neutral-950">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Datos de la evaluación</h3>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200">Fecha</label>
                <input
                  type="date"
                  value={evaluationDate}
                  onChange={(e) => setEvaluationDate(e.target.value)}
                  className="mt-1 w-full rounded border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200">Modalidad</label>
                <select
                  className="mt-1 w-full rounded border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
                  value={modality}
                  onChange={(e) => setModality(e.target.value as any)}
                >
                  <option value="INDIVIDUAL">Individual</option>
                  <option value="PAIR">Pareja</option>
                </select>
              </div>

              {modality === 'PAIR' && (
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200">Nombre pareja</label>
                  <Input
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    placeholder="Nombre de la pareja"
                    required
                  />
                </div>
              )}
            </div>
          </section>

          <section className="grid gap-4">
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Rúbrica 1 — Secuencias (’ote’a)</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Parte 1, 2 y 3: cerebro, direcciones y ritmos.
              </p>
            </div>

            <div className="grid gap-4">
              {SEQUENCE_PARTS.map((part) => (
                <RubricMatrix
                  key={part.title}
                  title={part.title}
                  items={part.items as any}
                  values={rubricSequences as unknown as Record<string, '' | Level>}
                  onChange={(key, value) =>
                    setRubricSequences((prev) => ({
                      ...prev,
                      [key as SequenceKey]: value,
                    }))
                  }
                  namePrefix={`seq-${part.title.toLowerCase().replace(/\s+/g, '-')}`}
                />
              ))}
            </div>
          </section>

          <section className="grid gap-4">
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Rúbrica 2 — Coreografía completa (’ote’a)</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Integración de coreografía, técnica e interpretación.
              </p>
            </div>

            <RubricMatrix
              title="Coreografía completa"
              items={CHOREO_ITEMS as any}
              values={rubricChoreo as unknown as Record<string, '' | Level>}
              onChange={(key, value) =>
                setRubricChoreo((prev) => ({
                  ...prev,
                  [key as ChoreoKey]: value,
                }))
              }
              namePrefix="choreo"
            />
          </section>

          <section className="grid gap-3 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-700 dark:bg-neutral-950">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Observaciones</h3>
            <textarea
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Escribe aquí las apreciaciones para la alumna…"
              className="min-h-[140px] w-full rounded border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
            />

            {saveError && (
              <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800/60 dark:bg-red-950/60 dark:text-red-300">
                {saveError}
              </div>
            )}
            {saveMessage && (
              <div className="rounded border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-900 dark:text-emerald-100">
                {saveMessage}
              </div>
            )}

            <div className="flex items-center justify-end">
              <Button type="submit" disabled={saving}>
                {saving ? 'Guardando…' : 'Guardar evaluación'}
              </Button>
            </div>
          </section>
        </form>
      </div>
    </div>
  )
}
