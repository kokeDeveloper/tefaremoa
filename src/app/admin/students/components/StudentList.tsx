"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import StudentForm from './StudentForm'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'

export default function StudentList({students, onDeleted}:{students:any[], onDeleted?:()=>void}){
  const [editingId, setEditingId] = useState<number|null>(null);
  const [toDelete, setToDelete] = useState<number|null>(null);
  if(!students || students.length===0) return <div>No hay alumnos</div>

  const confirmDelete = async ()=>{
    if(!toDelete) return;
    await fetch('/api/students/'+toDelete, { method: 'DELETE' });
    setToDelete(null);
    onDeleted && onDeleted();
  }
  return (
    <>
    <table className="w-full table-auto text-left">
      <thead>
        <tr>
          <th>Id</th>
          <th>Nombre</th>
          <th>Email</th>
          <th>Plan</th>
          <th>Acciones</th>
        </tr>
      </thead>
  <tbody>
        {students.map(s=> (
          <tr key={s.id} className="border-t">
            <td className="py-2">{s.id}</td>
            <td className="py-2">{editingId===s.id ? <StudentForm initial={s} onSaved={()=>{ setEditingId(null); onDeleted && onDeleted(); }} /> : `${s.name} ${s.lastName}`}</td>
            <td className="py-2">{s.email}</td>
            <td className="py-2">{s.planType}</td>
            <td className="py-2 flex gap-2">
              <Link href={`/admin/students/${s.id}`} className="text-blue-600">Ver / Editar</Link>
              <Button className="bg-green-600">Editar</Button>
              <Button className="bg-red-600" onClick={()=>setToDelete(s.id)}>Eliminar</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <Modal open={!!toDelete} title="Confirmar eliminación" onClose={()=>setToDelete(null)}>
      <div>¿Seguro que desea eliminar el alumno?</div>
      <div className="mt-4 flex justify-end gap-2">
        <Button onClick={()=>setToDelete(null)} className="border">Cancelar</Button>
        <Button onClick={confirmDelete} className="bg-red-600">Eliminar</Button>
      </div>
    </Modal>
    </>
  )
}
