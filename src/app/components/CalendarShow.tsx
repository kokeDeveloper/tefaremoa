"use client";

import React, { useState } from "react";
import { cn } from "@/util/cn";

// ──────────────────────────────────────────────
// Tipos
// ──────────────────────────────────────────────

export interface Rehearsal {
  id: string;
  title: string;
  date: Date;
  timeRange?: string;
  location?: string;
  notes?: string;
  participants?: string;
  cancelled?: boolean;
}

interface CalendarShowProps {
  rehearsals?: Rehearsal[];
  className?: string;
}

// ──────────────────────────────────────────────
// Datos reales — temporada 2026
// ──────────────────────────────────────────────

const MOCK_REHEARSALS: Rehearsal[] = [
  {
    id: "1",
    title: "'Ote'a Pajarito",
    date: new Date(2026, 5, 17),
    timeRange: "20:00 – 20:30",
  },
  {
    id: "2",
    title: "Ensayo directores",
    date: new Date(2026, 5, 20),
    notes: "Evaluación de proceso",
  },
  {
    id: "3",
    title: "Día del Padre",
    date: new Date(2026, 5, 21),
    cancelled: true,
  },
  {
    id: "4",
    title: "'Ote'a Heivara'a",
    date: new Date(2026, 5, 24),
    timeRange: "20:00 – 20:45",
    participants: "Catalina R. · Javiera H. · Vanessa A. · Valentina C. · Ángela O.",
  },
  {
    id: "5",
    title: "Ensayo por grupos + General",
    date: new Date(2026, 5, 28),
    timeRange: "11:30 – 16:00",
    notes:
      "11:00 – 11:30  Grupo Lunes\n11:30 – 12:00  Grupo Miércoles\n12:00 – 12:30  Grupo Jueves\n12:30 – 13:00  Grupo Viernes\n13:00 – 14:20  Almuerzo\n14:30 – 16:00  Ensayo General",
  },
  {
    id: "6",
    title: "'Ote'a Láser Red",
    date: new Date(2026, 6, 1),
    timeRange: "20:00 – 20:45",
    participants:
      "Michélle E. · Natalia B. · Nathalie C. · Natalia Ca. · Daniela V. · Micaela Ca. · Margarita O. · Paula R. · Ángela O.",
  },
  {
    id: "7",
    title: "Ensayo General + Confección",
    date: new Date(2026, 6, 4),
    notes: "11:00 – 13:30  Ensayo General\n15:00 – 21:00  Confección de trajes",
  },
  {
    id: "8",
    title: "Ensayo Músicos",
    date: new Date(2026, 6, 8),
    timeRange: "20:00 – 21:00",
    notes: "Ensayos solos Matarena y Ángela",
  },
  {
    id: "9",
    title: "Ensayo Músicos",
    date: new Date(2026, 6, 11), // sábado — probable typo en el original (listado como "4 jul")
    timeRange: "12:00 – 14:00",
  },
  {
    id: "10",
    title: "'Ote'a Láser Red y 'Ote'a Heivara'a",
    date: new Date(2026, 6, 15),
    timeRange: "20:00 – 20:50",
  },
  {
    id: "11",
    title: "Ensayo General",
    date: new Date(2026, 6, 19),
    timeRange: "14:30 – 17:30",
  },
  {
    id: "12",
    title: "Ensayo por grupos + General",
    date: new Date(2026, 6, 26),
    timeRange: "11:30 – 16:30",
    notes:
      "11:00 – 11:30  Grupo Lunes\n11:30 – 12:00  Grupo Miércoles\n12:00 – 12:30  Grupo Jueves\n12:30 – 13:00  Grupo Viernes\n13:00 – 14:15  Almuerzo\n14:15 – 16:30  Ensayo General",
  },
  {
    id: "13",
    title: "Ensayo SOS",
    date: new Date(2026, 6, 29),
    timeRange: "20:00 – 21:00",
  },
];

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

const DAYS_ES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTHS_ES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

function formatDate(date: Date) {
  return `${DAYS_ES[date.getDay()]} ${date.getDate()} de ${MONTHS_ES[date.getMonth()]}`;
}

function daysUntil(date: Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function badgeLabel(days: number): string {
  if (days < 0) return "Pasado";
  if (days === 0) return "Hoy";
  if (days === 1) return "Mañana";
  return `En ${days} días`;
}

function badgeClasses(days: number): string {
  if (days < 0) return "border border-white/10 text-white/30";
  if (days <= 3) return "border border-orange-400 text-orange-400";
  if (days <= 7) return "border border-orange-400/50 text-orange-300";
  return "border border-white/20 text-white/60";
}

function openGoogleCalendar(rehearsal: Rehearsal) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const d = rehearsal.date;
  const dateStr = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;

  let dates: string;
  const m = rehearsal.timeRange?.match(/(\d{1,2}):(\d{2})\s*[–\-]\s*(\d{1,2}):(\d{2})/);
  if (m) {
    const start = `${dateStr}T${pad(Number(m[1]))}${pad(Number(m[2]))}00`;
    const end   = `${dateStr}T${pad(Number(m[3]))}${pad(Number(m[4]))}00`;
    dates = `${start}/${end}`;
  } else {
    // All-day: end date is the next day
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    const nextStr = `${next.getFullYear()}${pad(next.getMonth() + 1)}${pad(next.getDate())}`;
    dates = `${dateStr}/${nextStr}`;
  }

  const details = [rehearsal.notes, rehearsal.participants].filter(Boolean).join("\n");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Te Fare Mo'a – ${rehearsal.title}`,
    dates,
    ...(details && { details }),
    ...(rehearsal.location && { location: rehearsal.location }),
  });

  window.open(`https://calendar.google.com/calendar/render?${params.toString()}`, "_blank", "noopener,noreferrer");
}

// ──────────────────────────────────────────────
// Componente
// ──────────────────────────────────────────────

export default function CalendarShow({ rehearsals = MOCK_REHEARSALS, className }: CalendarShowProps) {
  const cutoff = new Date(2026, 6, 30);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const upcoming = rehearsals
    .filter((r) => r.date <= cutoff)
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const pending = upcoming.filter((r) => !r.cancelled && daysUntil(r.date) >= 0).length;

  return (
    <section className={cn("w-full py-16 md:py-24 px-4 bg-black", className)}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-10 md:mb-14">
          <p className="text-xs md:text-sm uppercase tracking-[0.5em] text-orange-400 mb-3">
            Temporada 2026
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Próximos ensayos
          </h2>
          <div className="w-20 h-1 bg-orange-400 rounded-full mb-4" />
          <p className="text-gray-400 text-sm md:text-base">
            Fechas de ensayos hasta el{" "}
            <span className="text-orange-400 font-semibold">30 de julio</span>
            {pending > 0 && (
              <> &mdash; <span className="text-white/60">{pending} pendiente{pending !== 1 ? "s" : ""}</span></>
            )}
          </p>
        </div>

        {/* Grid de ensayos */}
        {upcoming.length === 0 ? (
          <p className="text-center text-gray-500 py-12">No hay ensayos programados.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcoming.map((rehearsal) => {
              const days = daysUntil(rehearsal.date);
              const isPast = days < 0;
              const isCancelled = rehearsal.cancelled === true;
              const hasDetails = !isCancelled && !!(rehearsal.location || rehearsal.notes || rehearsal.participants);
              const isExpanded = expandedId === rehearsal.id;
              const canSchedule = !isCancelled && !isPast;

              return (
                <li
                  key={rehearsal.id}
                  className={cn(
                    "relative rounded-2xl border p-5 flex flex-col gap-3 transition-colors",
                    isCancelled
                      ? "border-red-900/30 bg-red-950/10 opacity-50"
                      : isPast
                      ? "border-white/5 bg-white/[0.02] opacity-40"
                      : "border-orange-400/20 bg-white/[0.04] hover:bg-white/[0.07]"
                  )}
                >
                  {/* Fecha + título */}
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0",
                      isCancelled ? "bg-red-900/20" : isPast ? "bg-white/5" : "bg-orange-400/10"
                    )}>
                      <span className={cn(
                        "text-xl font-bold leading-none",
                        isCancelled ? "text-red-400/60" : isPast ? "text-white/30" : "text-orange-400"
                      )}>
                        {rehearsal.date.getDate()}
                      </span>
                      <span className={cn(
                        "text-[10px] font-semibold uppercase tracking-wide mt-0.5",
                        isCancelled ? "text-red-400/40" : isPast ? "text-white/20" : "text-orange-400/70"
                      )}>
                        {MONTHS_ES[rehearsal.date.getMonth()].slice(0, 3)}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className={cn(
                        "text-sm font-bold uppercase tracking-wide leading-tight",
                        isCancelled ? "line-through text-white/30" : isPast ? "text-white/30" : "text-white"
                      )}>
                        {rehearsal.title}
                      </p>
                      <p className={cn(
                        "text-xs mt-0.5",
                        isCancelled || isPast ? "text-white/20" : "text-white/50"
                      )}>
                        {DAYS_ES[rehearsal.date.getDay()]}
                      </p>
                      {rehearsal.timeRange && !isCancelled && (
                        <p className={cn(
                          "text-xs font-semibold mt-1",
                          isPast ? "text-white/20" : "text-orange-400"
                        )}>
                          {rehearsal.timeRange}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Detalles expandibles */}
                  {hasDetails && isExpanded && (
                    <div className={cn(
                      "rounded-lg p-3 border space-y-1.5",
                      isPast ? "bg-white/[0.02] border-white/5" : "bg-black/30 border-white/10"
                    )}>
                      {rehearsal.location && (
                        <p className={cn("text-xs", isPast ? "text-white/20" : "text-white/60")}>
                          <span className="mr-1.5">📍</span>{rehearsal.location}
                        </p>
                      )}
                      {rehearsal.notes && (
                        <p className={cn("text-xs whitespace-pre-line leading-relaxed", isPast ? "text-white/20" : "text-white/50")}>
                          {rehearsal.notes}
                        </p>
                      )}
                      {rehearsal.participants && (
                        <p className={cn("text-xs italic leading-relaxed", isPast ? "text-white/20" : "text-orange-400/60")}>
                          {rehearsal.participants}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Footer: badge + botones */}
                  <div className="flex flex-wrap items-center gap-2 mt-auto">
                    <span className={cn(
                      "text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full",
                      isCancelled
                        ? "border border-red-500/40 text-red-400/60"
                        : badgeClasses(days)
                    )}>
                      {isCancelled ? "No hay ensayo" : badgeLabel(days)}
                    </span>

                    <div className="flex items-center gap-2 ml-auto">
                      {hasDetails && (
                        <button
                          type="button"
                          onClick={() => setExpandedId(isExpanded ? null : rehearsal.id)}
                          className={cn(
                            "text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full border transition-colors",
                            isPast
                              ? "border-white/10 text-white/20"
                              : isExpanded
                              ? "border-orange-400/50 text-orange-400 bg-orange-400/10"
                              : "border-white/20 text-white/50 hover:border-orange-400/40 hover:text-orange-400"
                          )}
                        >
                          {isExpanded ? "Cerrar" : "Detalles"}
                        </button>
                      )}

                      {canSchedule && (
                        <button
                          type="button"
                          onClick={() => openGoogleCalendar(rehearsal)}
                          className="text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full border border-orange-400/60 text-orange-400 bg-orange-400/10 hover:bg-orange-400/20 transition-colors"
                        >
                          Agendar
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
