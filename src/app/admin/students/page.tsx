"use client"
import React, { useEffect, useState } from 'react';
import StudentList from './components/StudentList';
import StudentForm from './components/StudentForm';
import PlanAlertsPanel, { PlanAlertsResponse } from './components/PlanAlertsPanel';

export default function AdminStudentsPage(){
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [alerts, setAlerts] = React.useState<PlanAlertsResponse | null>(null);
  const [alertsLoading, setAlertsLoading] = React.useState(false);
  const [alertsError, setAlertsError] = React.useState<string|null>(null);
  const [alertThreshold, setAlertThreshold] = React.useState(7);
  const [includeNoPlan, setIncludeNoPlan] = React.useState(true);
  const pageSize = 10;

  const fetchStudents = React.useCallback(async ()=>{
    setLoading(true);
    try{
      const q = `?skip=${(page-1)*pageSize}&take=${pageSize}&search=${encodeURIComponent(search)}`;
  const res = await fetch('/api/students' + q, { headers: { 'Content-Type': 'application/json' } });
  const data = await res.json();
  setStudents(data.items || []);
  setTotal(data.total || 0);
    }catch(e){ console.error(e); setError(String(e)); }
    setLoading(false);
  }, [page, pageSize, search]);

  const fetchAlerts = React.useCallback(async (options?: { thresholdDays?: number; includeNoPlan?: boolean })=>{
    setAlertsLoading(true);
    setAlertsError(null);
    try{
      const threshold = options?.thresholdDays ?? alertThreshold;
      const include = options?.includeNoPlan ?? includeNoPlan;
      setAlertThreshold(threshold);
      setIncludeNoPlan(include);
      const res = await fetch(`/api/alerts/plan-expiring?days=${threshold}&includeNoPlan=${include}`, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if(!res.ok){
        const err = await res.json().catch(()=>({ error: res.statusText }));
        throw new Error(err.error || `Error ${res.status}`);
      }
      const data: PlanAlertsResponse = await res.json();
      setAlerts(data);
    }catch(e:any){
      console.error(e);
      setAlertsError(String(e.message || e));
    }
    setAlertsLoading(false);
  }, [alertThreshold, includeNoPlan]);

  React.useEffect(()=>{ fetchStudents() }, [fetchStudents]);
  React.useEffect(()=>{ fetchAlerts() }, [fetchAlerts]);

  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-4 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
        <h2 className="text-xl font-medium mb-4">Administración de Alumnos</h2>
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <input placeholder="Buscar por nombre o email" value={search} onChange={e=>setSearch(e.target.value)} className="border p-2 rounded flex-1" />
            <button onClick={()=>{ setPage(1); fetchStudents(); fetchAlerts(); }} className="btn-donate px-3 py-2 rounded">Buscar</button>
          </div>
          <StudentForm onSaved={()=>{ fetchStudents(); fetchAlerts(); }} />
        </div>
        <PlanAlertsPanel
          data={alerts}
          loading={alertsLoading}
          error={alertsError}
          onRefresh={() => fetchAlerts()}
          thresholdDays={alertThreshold}
          includeNoPlan={includeNoPlan}
          onOptionsChange={(options) => fetchAlerts(options)}
        />
        <div className="flex-1 overflow-auto">
          {loading ? <div>Cargando...</div> : <>
            <StudentList students={students} onDeleted={()=>{ fetchStudents(); fetchAlerts(); }} />
            <div className="flex justify-between items-center mt-4">
              <div />
              <div className="flex gap-2">
                <button disabled={page<=1} onClick={()=>{ if(page>1){ setPage(p=>p-1); fetchStudents(); } }} className="px-3 py-1 border rounded disabled:opacity-50">Anterior</button>
                <button disabled={page*pageSize>=total} onClick={()=>{ if(page*pageSize<total){ setPage(p=>p+1); fetchStudents(); } }} className="px-3 py-1 border rounded disabled:opacity-50">Siguiente</button>
                <div className="text-sm text-neutral-600">Mostrando {(page-1)*pageSize+1} - {Math.min(page*pageSize, total)} de {total}</div>
              </div>
            </div>
          </>}</div>
      </div>
    </div>
  )
}
