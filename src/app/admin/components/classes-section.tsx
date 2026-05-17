'use client'
import React, { useCallback, useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import { IconPlus, IconLayoutList, IconUsers } from '@tabler/icons-react'
import ClassList from '../classes/components/ClassList'
import ClassForm, { ClassRecord } from '../classes/components/ClassForm'
import ClassDetail from '../classes/components/ClassDetail'
import InstructorManager from '../classes/components/InstructorManager'

type Tab = 'classes' | 'instructors'

export function ClassesSection() {
  const [tab, setTab] = useState<Tab>('classes')
  const [classes, setClasses] = useState<ClassRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [showForm, setShowForm] = useState(false)
  const [editingClass, setEditingClass] = useState<ClassRecord | null>(null)
  const [detailClassId, setDetailClassId] = useState<number | null>(null)

  const fetchClasses = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/classes', { credentials: 'include' })
      if (!res.ok) throw new Error('Error al cargar clases')
      const data = await res.json()
      setClasses(Array.isArray(data) ? data : [])
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchClasses() }, [fetchClasses])

  const handleEdit = (cls: ClassRecord) => {
    setEditingClass(cls)
    setShowForm(true)
  }

  const handleFormSaved = () => {
    setShowForm(false)
    setEditingClass(null)
    fetchClasses()
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingClass(null)
  }

  return (
    <div className="flex w-full h-full overflow-hidden">
      {/* Main panel */}
      <div className={`flex flex-col flex-1 overflow-hidden transition-all ${detailClassId ? 'w-0 md:w-auto' : ''}`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 dark:border-neutral-700">
          <div>
            <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">Clases</h2>
            <p className="text-xs text-neutral-500 mt-0.5">Gestión de clases e instructores</p>
          </div>
          {tab === 'classes' && (
            <Button
              className="bg-emerald-600 text-white text-sm px-3 py-1.5 hover:bg-emerald-700 flex items-center gap-1"
              onClick={() => { setEditingClass(null); setShowForm(true) }}
            >
              <IconPlus size={15} /> Nueva clase
            </Button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-neutral-200 dark:border-neutral-700 px-5">
          <button
            onClick={() => setTab('classes')}
            className={`flex items-center gap-1.5 px-1 py-2.5 text-sm border-b-2 transition-colors mr-4 ${
              tab === 'classes'
                ? 'border-emerald-500 text-emerald-700 dark:text-emerald-400 font-medium'
                : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            <IconLayoutList size={15} /> Clases
          </button>
          <button
            onClick={() => setTab('instructors')}
            className={`flex items-center gap-1.5 px-1 py-2.5 text-sm border-b-2 transition-colors ${
              tab === 'instructors'
                ? 'border-emerald-500 text-emerald-700 dark:text-emerald-400 font-medium'
                : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            <IconUsers size={15} /> Instructores
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {tab === 'classes' && (
            <>
              {loading && <p className="text-sm text-neutral-400">Cargando…</p>}
              {error && <p className="text-sm text-red-500">{error}</p>}
              {!loading && !error && (
                <ClassList
                  classes={classes}
                  onEdit={handleEdit}
                  onDeleted={fetchClasses}
                  onSelectDetail={setDetailClassId}
                />
              )}
            </>
          )}
          {tab === 'instructors' && <InstructorManager />}
        </div>
      </div>

      {/* Detail side panel */}
      {detailClassId !== null && (
        <div className="w-full md:w-96 border-l border-neutral-200 dark:border-neutral-700 flex flex-col overflow-hidden bg-white dark:bg-neutral-900">
          <ClassDetail
            classId={detailClassId}
            onClose={() => setDetailClassId(null)}
            onUpdated={fetchClasses}
          />
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        open={showForm}
        title={editingClass ? 'Editar clase' : 'Nueva clase'}
        onClose={handleFormCancel}
      >
        <ClassForm
          initial={editingClass}
          onSaved={handleFormSaved}
          onCancel={handleFormCancel}
        />
      </Modal>
    </div>
  )
}
