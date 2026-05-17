"use client"
import React, { useCallback, useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { IconArrowLeft, IconUser, IconSchool, IconQrcode } from '@tabler/icons-react'
import StudentForm from '../components/StudentForm'
import StudentEnrollmentsPanel from '../components/StudentEnrollmentsPanel'
import { cn } from '@/util/cn'

type Tab = 'datos' | 'clases'

export default function StudentDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [student, setStudent] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState<Tab>('datos')
  const router = useRouter()

  const fetchStudent = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/students/' + id, { credentials: 'include' })
      if (!res.ok) return
      const j = await res.json()
      setStudent(j)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { fetchStudent() }, [fetchStudent])

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-neutral-400 text-sm">Cargando…</div>
  )
  if (!student) return (
    <div className="flex items-center justify-center h-64 text-neutral-400 text-sm">Alumna no encontrada.</div>
  )

  const tabClass = (t: Tab) => cn(
    'flex items-center gap-1.5 px-1 py-3 text-sm border-b-2 transition-colors mr-5',
    tab === t
      ? 'border-emerald-500 text-emerald-700 dark:text-emerald-400 font-medium'
      : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
      {/* Back + title */}
      <div className="flex items-center gap-3 flex-wrap">
        <Link
          href="/admin?section=students"
          className="flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
        >
          <IconArrowLeft size={16} /> Volver
        </Link>
        <span className="text-neutral-300 dark:text-neutral-600">|</span>
        <h1 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 flex-1">
          {student.name} {student.lastName}
          <span className="ml-2 text-xs font-normal text-neutral-400">#{student.id}</span>
        </h1>
        <a
          href={`/api/students/${student.id}/qr`}
          download
          className="flex items-center gap-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 px-3 py-1.5 text-xs text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          title="Descargar QR de la alumna"
        >
          <IconQrcode size={15} /> QR
        </a>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-200 dark:border-neutral-700 flex">
        <button onClick={() => setTab('datos')} className={tabClass('datos')}>
          <IconUser size={15} /> Datos y plan
        </button>
        <button onClick={() => setTab('clases')} className={tabClass('clases')}>
          <IconSchool size={15} /> Clases inscritas
          {student.enrollments?.length > 0 && (
            <span className="ml-1 inline-flex items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs w-5 h-5 font-semibold">
              {student.enrollments.length}
            </span>
          )}
        </button>
      </div>

      {/* Tab content */}
      {tab === 'datos' && (
        <div className="space-y-6">
          <StudentForm initial={student} onSaved={fetchStudent} />
          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <button
              className="text-sm text-red-500 hover:text-red-700 transition-colors"
              onClick={async () => {
                if (!confirm(`¿Eliminar a ${student.name} ${student.lastName}? Esta acción no se puede deshacer.`)) return
                await fetch('/api/students/' + student.id, { method: 'DELETE', credentials: 'include' })
                router.push('/admin?section=students')
              }}
            >
              Eliminar alumna permanentemente
            </button>
          </div>
        </div>
      )}

      {tab === 'clases' && (
        <StudentEnrollmentsPanel
          studentId={student.id}
          planStatus={student.planStatus}
          enrollments={student.enrollments ?? []}
          onUpdated={fetchStudent}
        />
      )}
    </div>
  )
}

