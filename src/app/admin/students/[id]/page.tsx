"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import StudentForm from '../components/StudentForm'

export default function StudentDetailPage({ params }:{ params:{ id:string } }){
  const [student, setStudent] = useState<any|null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchStudent = async ()=>{
    setLoading(true);
    try{
      const res = await fetch('/api/students/' + params.id);
      if(!res.ok) return;
      const j = await res.json();
      setStudent(j);
    }catch(e){ console.error(e); }
    setLoading(false);
  }

  useEffect(()=>{ fetchStudent() }, []);

  if(loading) return <div>Cargando...</div>
  if(!student) return <div>No encontrado</div>

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Editar Alumno #{student.id}</h2>
      <StudentForm initial={student} onSaved={()=> fetchStudent()} />
      <div className="mt-4">
        <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={async()=>{ if(!confirm('Eliminar?')) return; await fetch('/api/students/'+student.id,{method:'DELETE'}); router.push('/admin/students'); }}>Eliminar</button>
      </div>
    </div>
  )
}
