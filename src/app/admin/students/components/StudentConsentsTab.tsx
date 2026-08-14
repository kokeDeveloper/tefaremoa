"use client";

import { useEffect, useState } from "react";
import { ACADEMY_DOCUMENTS } from "@/lib/documentTexts";
import { IconCircleCheck, IconCircleX } from "@tabler/icons-react";

interface ConsentEntry {
  accepted: boolean;
  acceptedAt?: string;
  version?: string;
}

interface ConsentStatus {
  [documentKey: string]: ConsentEntry;
}

interface Props {
  studentId: number;
}

export default function StudentConsentsTab({ studentId }: Props) {
  const [status, setStatus] = useState<ConsentStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetch(`/api/admin/consents`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        const student = data.students?.find((s: any) => s.id === studentId);
        setStatus(student?.status ?? null);
      })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [studentId]);

  if (loading) {
    return <p className="text-sm text-neutral-500 py-4">Cargando…</p>;
  }

  if (!status) {
    return <p className="text-sm text-neutral-500 py-4">No se encontraron datos de consentimientos.</p>;
  }

  return (
    <div className="space-y-3">
      {ACADEMY_DOCUMENTS.map((doc) => {
        const entry = status[doc.key];
        const accepted = entry?.accepted ?? false;
        return (
          <div
            key={doc.key}
            className={`rounded-xl border px-5 py-4 flex items-start gap-4 ${
              accepted
                ? "bg-green-950/20 border-green-800/40"
                : "bg-red-950/20 border-red-800/40"
            }`}
          >
            {accepted ? (
              <IconCircleCheck size={20} className="text-green-500 shrink-0 mt-0.5" />
            ) : (
              <IconCircleX size={20} className="text-red-500 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-100">{doc.title}</p>
              <p className="text-xs text-neutral-500 mt-0.5">Versión del documento: {doc.version}</p>
              {accepted && entry.acceptedAt ? (
                <p className="text-xs text-green-400 mt-1">
                  Aceptado el{" "}
                  {new Date(entry.acceptedAt).toLocaleDateString("es-CL", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {entry.version && entry.version !== doc.version && (
                    <span className="ml-2 text-amber-400">(versión {entry.version} — documento actualizado)</span>
                  )}
                </p>
              ) : (
                <p className="text-xs text-red-400 mt-1">Pendiente de aceptación</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
