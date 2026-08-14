"use client";

import { useEffect, useState } from "react";
import { ACADEMY_DOCUMENTS } from "@/lib/documentTexts";
import { IconCircleCheck, IconCircleX, IconRefresh } from "@tabler/icons-react";

interface ConsentEntry {
  accepted: boolean;
  acceptedAt?: string;
  version?: string;
}

interface StudentRow {
  id: number;
  name: string;
  lastName: string;
  email: string;
  status: Record<string, ConsentEntry>;
  allAccepted: boolean;
}

export function ConsentsSection() {
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "done">("all");

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/consents", { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error");
      setStudents(data.students ?? []);
    } catch (e: any) {
      setError(e?.message || "Error al cargar");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = students.filter((s) => {
    if (filter === "done") return s.allAccepted;
    if (filter === "pending") return !s.allAccepted;
    return true;
  });

  const doneCount = students.filter((s) => s.allAccepted).length;
  const pendingCount = students.length - doneCount;

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-neutral-200 dark:border-neutral-700 shrink-0 flex-wrap gap-3">
        <div>
          <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">Consentimientos digitales</h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            {doneCount} de {students.length} alumnas han aceptado todos los documentos
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden text-xs">
            {(["all", "done", "pending"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 transition-colors ${
                  filter === f
                    ? "bg-orange-500 text-white font-medium"
                    : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
                }`}
              >
                {f === "all" ? `Todas (${students.length})` : f === "done" ? `Completas (${doneCount})` : `Pendientes (${pendingCount})`}
              </button>
            ))}
          </div>
          <button
            onClick={load}
            className="flex items-center gap-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 px-3 py-1.5 text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
          >
            <IconRefresh size={13} /> Actualizar
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {loading && (
          <p className="text-sm text-neutral-500 text-center py-8">Cargando…</p>
        )}
        {error && (
          <p className="text-sm text-red-500 text-center py-8">{error}</p>
        )}
        {!loading && !error && filtered.length === 0 && (
          <p className="text-sm text-neutral-500 text-center py-8">No hay alumnas en esta categoría.</p>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="space-y-2">
            {/* Column headers */}
            <div className="grid items-center gap-3 px-3 pb-1 text-xs font-medium text-neutral-500 uppercase tracking-wider"
              style={{ gridTemplateColumns: "1fr " + ACADEMY_DOCUMENTS.map(() => "min(180px,1fr)").join(" ") }}
            >
              <span>Alumna</span>
              {ACADEMY_DOCUMENTS.map((d) => (
                <span key={d.key} className="text-center truncate" title={d.title}>{d.title.split("—")[0].trim()}</span>
              ))}
            </div>

            {filtered.map((s) => (
              <div
                key={s.id}
                className={`grid items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors ${
                  s.allAccepted
                    ? "border-neutral-200/60 dark:border-neutral-700/60 bg-white dark:bg-neutral-900"
                    : "border-amber-200/60 dark:border-amber-800/30 bg-amber-50/30 dark:bg-amber-950/10"
                }`}
                style={{ gridTemplateColumns: "1fr " + ACADEMY_DOCUMENTS.map(() => "min(180px,1fr)").join(" ") }}
              >
                <div className="min-w-0">
                  <p className="font-medium text-neutral-900 dark:text-neutral-100 truncate">
                    {s.name} {s.lastName}
                  </p>
                  <p className="text-xs text-neutral-500 truncate">{s.email}</p>
                </div>

                {ACADEMY_DOCUMENTS.map((doc) => {
                  const entry = s.status[doc.key];
                  const ok = entry?.accepted;
                  return (
                    <div key={doc.key} className="flex flex-col items-center gap-0.5">
                      {ok ? (
                        <>
                          <IconCircleCheck size={18} className="text-green-500" />
                          <span className="text-[10px] text-green-600 dark:text-green-400 text-center">
                            {new Date(entry.acceptedAt!).toLocaleDateString("es-CL", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "2-digit",
                            })}
                          </span>
                        </>
                      ) : (
                        <>
                          <IconCircleX size={18} className="text-red-400" />
                          <span className="text-[10px] text-red-500 dark:text-red-400">Pendiente</span>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
