"use client"
import React, { useEffect, useId, useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

type StudentFormValues = {
  name: string
  lastName: string
  email: string
  phone: string
  nickname: string
  address: string
  city: string
  birthDate: string
  planStartDate: string
  planEndDate: string
  planType: string
  planStatus: string
  password: string
}

const PLAN_TYPES = ['Basic', 'Premium', 'VIP']
const PLAN_STATUSES = ['Active', 'ExpiringSoon', 'Expired', 'NoPlan']

function toInputDate(value?: string | Date | null): string {
  if (!value) return ''
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().split('T')[0]
}

function normalizePayload(form: StudentFormValues) {
  const parseDate = (value: string) => (value ? new Date(value).toISOString() : null)
  const emptyToNull = (value: string) => (value.trim() === '' ? null : value.trim())

  return {
    name: form.name.trim(),
    firstName: form.name.trim(),
    lastName: form.lastName.trim(),
    email: form.email.trim(),
    phone: emptyToNull(form.phone),
    nickname: emptyToNull(form.nickname),
    address: emptyToNull(form.address),
    city: emptyToNull(form.city),
    birthDate: parseDate(form.birthDate),
    planStartDate: parseDate(form.planStartDate),
    planEndDate: parseDate(form.planEndDate),
    planType: form.planType,
    planStatus: form.planStatus,
  }
}

type StudentFormProps = {
  initial?: any
  onSaved: () => void
  variant?: 'standalone' | 'embedded'
}

export default function StudentForm({ initial, onSaved, variant = 'standalone' }: StudentFormProps) {
  const [form, setForm] = useState<StudentFormValues>(() => ({
    name: initial?.name || '',
    lastName: initial?.lastName || '',
    email: initial?.email || '',
    phone: initial?.phone || '',
    nickname: initial?.nickname || '',
    address: initial?.address || '',
    city: initial?.city || '',
    birthDate: toInputDate(initial?.birthDate),
    planStartDate: toInputDate(initial?.planStartDate),
    planEndDate: toInputDate(initial?.planEndDate),
    planType: initial?.planType || PLAN_TYPES[0],
    planStatus: initial?.planStatus || PLAN_STATUSES[0],
    password: '',
  }))
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const formInstanceId = useId()
  const isEmbedded = variant === 'embedded'
  const isEditing = Boolean(initial?.id)

  useEffect(() => {
    if (!initial) return
    setForm((prev) => ({
      ...prev,
      name: initial?.name || '',
      lastName: initial?.lastName || '',
      email: initial?.email || '',
      phone: initial?.phone || '',
      nickname: initial?.nickname || '',
      address: initial?.address || '',
      city: initial?.city || '',
      birthDate: toInputDate(initial?.birthDate),
      planStartDate: toInputDate(initial?.planStartDate),
      planEndDate: toInputDate(initial?.planEndDate),
      planType: initial?.planType || PLAN_TYPES[0],
      planStatus: initial?.planStatus || PLAN_STATUSES[0],
    }))
  }, [initial])

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const method = initial?.id ? 'PUT' : 'POST'
      const url = initial?.id ? `/api/students/${initial.id}` : '/api/students'
      const payload: any = normalizePayload(form)

      if (!initial?.id) {
        if (!form.password) {
          setError('La contraseña es obligatoria para crear una alumna.')
          setLoading(false)
          return
        }
        payload.password = form.password
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        setError(data.error || 'No se pudo guardar la información.')
        return
      }

      setForm((prev) => ({ ...prev, password: '' }))
      onSaved()
    } catch (err: any) {
      setError(String(err.message || err))
    } finally {
      setLoading(false)
    }
  }

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h4 className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
      {children}
    </h4>
  )

  return (
    <div
      className={
        isEmbedded
          ? 'space-y-6'
          : 'space-y-6 rounded-xl border border-neutral-200 bg-neutral-50 p-5 shadow-sm dark:border-neutral-700 dark:bg-neutral-950'
      }
    >
      {!isEmbedded && (
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            {isEditing ? 'Editar alumna' : 'Registrar nueva alumna'}
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Completa la información personal y del plan para mantener el seguimiento actualizado.
          </p>
        </div>
      )}

      <form onSubmit={submit} className="space-y-6">
        <section className="space-y-4">
          <SectionTitle>Datos personales</SectionTitle>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label
                htmlFor={`${formInstanceId}-name`}
                className="text-sm font-medium text-neutral-700 dark:text-neutral-200"
              >
                Nombre <span className="text-red-500">*</span>
              </label>
              <Input
                id={`${formInstanceId}-name`}
                required
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                placeholder="Nombre"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor={`${formInstanceId}-lastName`}
                className="text-sm font-medium text-neutral-700 dark:text-neutral-200"
              >
                Apellidos <span className="text-red-500">*</span>
              </label>
              <Input
                id={`${formInstanceId}-lastName`}
                required
                value={form.lastName}
                onChange={(event) => setForm({ ...form, lastName: event.target.value })}
                placeholder="Apellidos"
              />
            </div>
            <div className="flex flex-col gap-1 md:col-span-2">
              <label
                htmlFor={`${formInstanceId}-email`}
                className="text-sm font-medium text-neutral-700 dark:text-neutral-200"
              >
                Correo electrónico <span className="text-red-500">*</span>
              </label>
              <Input
                id={`${formInstanceId}-email`}
                required
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                placeholder="correo@ejemplo.com"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor={`${formInstanceId}-phone`} className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                Teléfono
              </label>
              <Input
                id={`${formInstanceId}-phone`}
                value={form.phone}
                onChange={(event) => setForm({ ...form, phone: event.target.value })}
                placeholder="(000) 000 0000"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor={`${formInstanceId}-nickname`} className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                Apodo
              </label>
              <Input
                id={`${formInstanceId}-nickname`}
                value={form.nickname}
                onChange={(event) => setForm({ ...form, nickname: event.target.value })}
                placeholder="Apodo"
              />
            </div>
            <div className="flex flex-col gap-1 md:col-span-2">
              <label htmlFor={`${formInstanceId}-address`} className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                Dirección
              </label>
              <Input
                id={`${formInstanceId}-address`}
                value={form.address}
                onChange={(event) => setForm({ ...form, address: event.target.value })}
                placeholder="Dirección"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor={`${formInstanceId}-city`} className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                Ciudad
              </label>
              <Input
                id={`${formInstanceId}-city`}
                value={form.city}
                onChange={(event) => setForm({ ...form, city: event.target.value })}
                placeholder="Ciudad"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor={`${formInstanceId}-birth`} className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                Fecha de nacimiento
              </label>
              <Input
                id={`${formInstanceId}-birth`}
                type="date"
                value={form.birthDate}
                onChange={(event) => setForm({ ...form, birthDate: event.target.value })}
              />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <SectionTitle>Plan y seguimiento</SectionTitle>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label htmlFor={`${formInstanceId}-planStart`} className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                Inicio del plan <span className="text-red-500">*</span>
              </label>
              <Input
                id={`${formInstanceId}-planStart`}
                type="date"
                required
                value={form.planStartDate}
                onChange={(event) => setForm({ ...form, planStartDate: event.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor={`${formInstanceId}-planEnd`} className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                Fin del plan
              </label>
              <Input
                id={`${formInstanceId}-planEnd`}
                type="date"
                value={form.planEndDate}
                onChange={(event) => setForm({ ...form, planEndDate: event.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor={`${formInstanceId}-planType`} className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                Tipo de plan
              </label>
              <select
                id={`${formInstanceId}-planType`}
                value={form.planType}
                onChange={(event) => setForm({ ...form, planType: event.target.value })}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100"
              >
                {PLAN_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor={`${formInstanceId}-planStatus`} className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                Estado del plan
              </label>
              <select
                id={`${formInstanceId}-planStatus`}
                value={form.planStatus}
                onChange={(event) => setForm({ ...form, planStatus: event.target.value })}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100"
              >
                {PLAN_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {!isEditing && (
          <section className="space-y-3">
            <SectionTitle>Credenciales de acceso</SectionTitle>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              La alumna podrá iniciar sesión con estas credenciales. Podrás actualizar la contraseña más tarde desde el perfil.
            </p>
            <div className="flex flex-col gap-1 md:w-1/2">
              <label htmlFor={`${formInstanceId}-password`} className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                Contraseña <span className="text-red-500">*</span>
              </label>
              <Input
                id={`${formInstanceId}-password`}
                required
                type="password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                placeholder="Contraseña temporal"
              />
            </div>
          </section>
        )}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 dark:border-red-800/60 dark:bg-red-950/60 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end">
          <Button
            disabled={loading}
            className="bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Guardando…' : isEditing ? 'Actualizar alumna' : 'Crear alumna'}
          </Button>
        </div>
      </form>
    </div>
  )
}
