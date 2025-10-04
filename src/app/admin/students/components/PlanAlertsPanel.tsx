"use client";

import React from "react";

type PlanStatus = "EXPIRED" | "EXPIRING_SOON" | "ACTIVE" | "NO_PLAN";

export interface PlanAlertDetails {
  status: PlanStatus;
  daysRemaining: number | null;
  isExpired: boolean;
  isExpiringSoon: boolean;
}

export interface PlanAlertStudent {
  id: number;
  name: string;
  lastName: string | null;
  email: string;
  planType: string | null;
  planStatus: string | null;
  planStartDate: string | null;
  planEndDate: string | null;
  alert: PlanAlertDetails;
}

export interface PlanAlertsResponse {
  generatedAt: string;
  thresholdDays: number;
  totals: {
    expired: number;
    expiringSoon: number;
    noPlan?: number;
  };
  students: {
    expired: PlanAlertStudent[];
    expiringSoon: PlanAlertStudent[];
    noPlan?: PlanAlertStudent[];
  };
}

interface Props {
  data: PlanAlertsResponse | null;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  thresholdDays: number;
  includeNoPlan: boolean;
  onOptionsChange: (options: { thresholdDays: number; includeNoPlan: boolean }) => void;
}

const badgeColors: Record<PlanStatus, string> = {
  EXPIRED: "bg-red-600 text-white",
  EXPIRING_SOON: "bg-amber-500 text-neutral-900",
  ACTIVE: "bg-emerald-600 text-white",
  NO_PLAN: "bg-neutral-500 text-white",
};

function formatDate(date: string | null) {
  if (!date) return "Sin fecha";
  return new Intl.DateTimeFormat("es-MX", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(new Date(date));
}

function formatRemainingDays(days: number | null) {
  if (days === null) return "—";
  if (days < 0) return `${Math.abs(days)} día(s) vencidos`;
  if (days === 0) return "Vence hoy";
  if (days === 1) return "Vence mañana";
  return `Vence en ${days} días`;
}

export default function PlanAlertsPanel({ data, loading, error, onRefresh, thresholdDays, includeNoPlan, onOptionsChange }: Props) {
  const [localThreshold, setLocalThreshold] = React.useState(thresholdDays);
  const [localIncludeNoPlan, setLocalIncludeNoPlan] = React.useState(includeNoPlan);

  React.useEffect(() => {
    setLocalThreshold(thresholdDays);
    setLocalIncludeNoPlan(includeNoPlan);
  }, [thresholdDays, includeNoPlan]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onOptionsChange({ thresholdDays: Math.max(localThreshold, 0), includeNoPlan: localIncludeNoPlan });
  };

  return (
    <div className="border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 bg-neutral-50 dark:bg-neutral-950 mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div>
          <h3 className="text-lg font-semibold">Alertas de planes próximos a vencer</h3>
          {data?.generatedAt && (
            <p className="text-sm text-neutral-500">
              Actualizado: {formatDate(data.generatedAt)} — umbral {data.thresholdDays} días
            </p>
          )}
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3 items-start md:items-center">
          <label className="flex items-center gap-2 text-sm">
            Umbral (días):
            <input
              type="number"
              min={0}
              max={90}
              value={localThreshold}
              onChange={(event) => setLocalThreshold(Number(event.target.value))}
              className="w-20 border border-neutral-300 dark:border-neutral-600 rounded px-2 py-1 bg-white dark:bg-neutral-900"
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={localIncludeNoPlan}
              onChange={(event) => setLocalIncludeNoPlan(event.target.checked)}
            />
            Incluir sin fecha fin
          </label>
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-3 py-1 rounded border border-neutral-300 dark:border-neutral-600 text-sm"
              disabled={loading}
            >
              Aplicar
            </button>
            <button
              type="button"
              onClick={onRefresh}
              className="btn-donate px-3 py-1 rounded text-sm"
              disabled={loading}
            >
              {loading ? "Actualizando..." : "Actualizar"}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200 p-3 rounded-md mb-4">
          Error al cargar alertas: {error}
        </div>
      )}

      {loading && !data && (
        <div className="text-sm text-neutral-500">Cargando alertas...</div>
      )}

      {data && (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="px-3 py-2 bg-red-600 text-white rounded-md">
              Vencidos: {data.totals.expired}
            </span>
            <span className="px-3 py-2 bg-amber-500 text-neutral-900 rounded-md">
              Próximos a vencer (&lt;= {data.thresholdDays} días): {data.totals.expiringSoon}
            </span>
            {typeof data.totals.noPlan === "number" && (
              <span className="px-3 py-2 bg-neutral-400 text-neutral-900 rounded-md">
                Sin fecha de fin: {data.totals.noPlan}
              </span>
            )}
          </div>

          <AlertGroup title="Planes vencidos" students={data.students.expired} state="EXPIRED" />
          <AlertGroup title="Planes por vencer" students={data.students.expiringSoon} state="EXPIRING_SOON" />

          {data.students.noPlan && data.students.noPlan.length > 0 && (
            <AlertGroup title="Planes sin fecha de fin" students={data.students.noPlan} state="NO_PLAN" />
          )}
        </div>
      )}

      {!loading && !error && data && data.totals.expired === 0 && data.totals.expiringSoon === 0 && (!data.students.noPlan || data.students.noPlan.length === 0) && (
        <p className="text-sm text-emerald-600 mt-4">No hay alertas pendientes, ¡todo bajo control!</p>
      )}
    </div>
  );
}

interface AlertGroupProps {
  title: string;
  students: PlanAlertStudent[];
  state: PlanStatus;
}

function AlertGroup({ title, students, state }: AlertGroupProps) {
  if (!students || students.length === 0) return null;

  return (
    <div className="space-y-2">
      <h4 className="text-md font-medium">{title}</h4>
      <div className="overflow-auto border border-neutral-200 dark:border-neutral-700 rounded-lg">
        <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700 text-sm">
          <thead className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200">
            <tr>
              <th className="px-3 py-2 text-left font-semibold">Alumna</th>
              <th className="px-3 py-2 text-left font-semibold">Correo</th>
              <th className="px-3 py-2 text-left font-semibold">Plan</th>
              <th className="px-3 py-2 text-left font-semibold">Fin del plan</th>
              <th className="px-3 py-2 text-left font-semibold">Estado calculado</th>
              <th className="px-3 py-2 text-left font-semibold">Estado en sistema</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {students.map((student) => (
              <tr key={student.id} className="bg-white dark:bg-neutral-900">
                <td className="px-3 py-2">
                  <div className="font-medium">
                    {student.name} {student.lastName ?? ""}
                  </div>
                </td>
                <td className="px-3 py-2">{student.email}</td>
                <td className="px-3 py-2">{student.planType ?? "—"}</td>
                <td className="px-3 py-2">{formatDate(student.planEndDate)}</td>
                <td className="px-3 py-2">
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${badgeColors[state]}`}>
                    {formatRemainingDays(student.alert.daysRemaining)}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <span className="text-xs font-semibold uppercase tracking-wide">
                    {student.planStatus ?? "—"}
                  </span>
                  {student.planStatus && student.planStatus !== badgeStateToLabel(state) && (
                    <span className="ml-2 text-xs text-amber-600 dark:text-amber-400">(desactualizado)</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function badgeStateToLabel(state: PlanStatus): string {
  switch (state) {
    case "EXPIRED":
      return "Expired";
    case "EXPIRING_SOON":
      return "ExpiringSoon";
    case "NO_PLAN":
      return "NoPlan";
    default:
      return "Active";
  }
}
