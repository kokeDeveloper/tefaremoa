"use client";

import dynamicImport from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/util/cn";
import {
  IconArrowLeft, IconQrcode, IconUserCheck, IconAlertTriangle, IconX,
  IconList, IconCamera, IconRefresh, IconCheck, IconMinus,
} from "@tabler/icons-react";

const QrScannerCamera = dynamicImport(() => import("./QrScannerCamera"), { ssr: false });

// â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

type ClassInfo = { id: number; name: string; schedule: string };

type ScannedEntry = {
  id: string;
  studentName: string;
  time: string;
  status: "ok" | "duplicate" | "error" | "warning";
  message?: string;
};

type RosterEntry = {
  studentId: number;
  name: string;
  lastName: string;
  email: string;
  present: boolean;
  attendanceId: number | null;
};

// â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function nowTime() {
  return new Date().toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function getInitials(name: string, lastName: string) {
  return ((name[0] ?? "") + (lastName[0] ?? "")).toUpperCase();
}

// â”€â”€ Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function ScannerPage() {
  const params = useParams();
  const router = useRouter();
  const classId = Number(params.classId);

  const [activeTab, setActiveTab] = useState<"scanner" | "lista">("scanner");
  const [classInfo, setClassInfo] = useState<ClassInfo | null>(null);
  const [loadingClass, setLoadingClass] = useState(true);

  // â”€â”€ Scanner state â”€â”€
  const [scanned, setScanned] = useState<ScannedEntry[]>([]);
  const [manualToken, setManualToken] = useState("");
  const [manualLoading, setManualLoading] = useState(false);
  const [scannerActive, setScannerActive] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);

  // â”€â”€ Lista manual state â”€â”€
  const [roster, setRoster] = useState<RosterEntry[]>([]);
  const [rosterLoading, setRosterLoading] = useState(false);
  const [toggling, setToggling] = useState<Set<number>>(new Set());

  // Load class info
  useEffect(() => {
    if (!classId) return;
    fetch(`/api/classes/${classId}`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setClassInfo({ id: d.id, name: d.name, schedule: d.schedule }))
      .catch(() => {})
      .finally(() => setLoadingClass(false));
  }, [classId]);

  // Scroll scanner log to bottom
  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [scanned]);

  // Load roster when switching to lista tab
  const loadRoster = useCallback(async () => {
    if (!classId) return;
    setRosterLoading(true);
    try {
      const res = await fetch(`/api/classes/${classId}/roster`, { credentials: "include" });
      const data = await res.json();
      if (res.ok) setRoster(data);
    } catch { /* ignore */ } finally {
      setRosterLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    if (activeTab === "lista") loadRoster();
  }, [activeTab, loadRoster]);

  // â”€â”€ Scanner handlers â”€â”€

  function addEntry(entry: Omit<ScannedEntry, "id" | "time">) {
    setScanned((prev) => [
      ...prev,
      { ...entry, id: Math.random().toString(36).slice(2), time: nowTime() },
    ]);
  }

  function handleScanResult(result: { ok: boolean; studentName: string; alreadyRecorded?: boolean; notEnrolled?: boolean; error?: string }) {
    if (result.ok) {
      addEntry({ studentName: result.studentName, status: result.notEnrolled ? "warning" : "ok", message: result.notEnrolled ? "Sin inscripciÃ³n activa" : undefined });
    } else if (result.alreadyRecorded) {
      addEntry({ studentName: result.studentName || "?", status: "duplicate", message: "Ya registrada hoy" });
    } else {
      addEntry({ studentName: result.error || "Error", status: "error" });
    }
  }

  async function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    const token = manualToken.trim();
    if (!token) return;
    setManualLoading(true);
    try {
      const res = await fetch("/api/attendance/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ qrToken: token, classId }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        addEntry({ studentName: `${data.student.name} ${data.student.lastName}`, status: data.notEnrolled ? "warning" : "ok", message: data.notEnrolled ? "Sin inscripciÃ³n activa" : undefined });
      } else if (res.status === 409) {
        addEntry({ studentName: `${data.student?.name ?? "?"} ${data.student?.lastName ?? ""}`.trim(), status: "duplicate", message: "Ya registrada hoy" });
      } else {
        addEntry({ studentName: data.error || "Error", status: "error" });
      }
    } catch {
      addEntry({ studentName: "Error de red", status: "error" });
    } finally {
      setManualLoading(false);
      setManualToken("");
    }
  }

  // â”€â”€ Lista handlers â”€â”€

  async function toggleAttendance(entry: RosterEntry) {
    if (toggling.has(entry.studentId)) return;
    setToggling((s) => new Set(s).add(entry.studentId));

    try {
      if (entry.present && entry.attendanceId) {
        // Remove attendance
        const res = await fetch(`/api/attendance?id=${entry.attendanceId}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (res.ok) {
          setRoster((prev) => prev.map((r) =>
            r.studentId === entry.studentId ? { ...r, present: false, attendanceId: null } : r
          ));
        }
      } else {
        // Mark present
        const res = await fetch("/api/attendance/manual", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ studentId: entry.studentId, classId }),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok || res.status === 409) {
          const attId = data.attendanceId;
          setRoster((prev) => prev.map((r) =>
            r.studentId === entry.studentId ? { ...r, present: true, attendanceId: attId } : r
          ));
        }
      }
    } catch { /* ignore */ } finally {
      setToggling((s) => { const ns = new Set(s); ns.delete(entry.studentId); return ns; });
    }
  }

  // â”€â”€ Styles â”€â”€

  const STATUS_STYLES: Record<ScannedEntry["status"], string> = {
    ok: "bg-emerald-500/15 border-emerald-500/40 text-emerald-300",
    warning: "bg-amber-500/15 border-amber-500/40 text-amber-300",
    duplicate: "bg-neutral-700/60 border-neutral-600 text-neutral-400",
    error: "bg-red-500/15 border-red-500/40 text-red-300",
  };
  const STATUS_ICONS: Record<ScannedEntry["status"], React.ReactNode> = {
    ok: <IconUserCheck size={15} />,
    warning: <IconAlertTriangle size={15} />,
    duplicate: <IconQrcode size={15} />,
    error: <IconX size={15} />,
  };

  const presentCount = roster.filter((r) => r.present).length;

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col">
      {/* â”€â”€ Header â”€â”€ */}
      <div className="bg-neutral-900 border-b border-neutral-800 px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.back()} className="text-neutral-400 hover:text-white transition-colors">
          <IconArrowLeft size={20} />
        </button>
        <div className="min-w-0 flex-1">
          {loadingClass ? (
            <div className="text-sm text-neutral-400">Cargando claseâ€¦</div>
          ) : classInfo ? (
            <>
              <h1 className="text-sm font-semibold truncate">{classInfo.name}</h1>
              <p className="text-xs text-neutral-400">
                {new Date(classInfo.schedule).toLocaleDateString("es-CL", { weekday: "long", hour: "2-digit", minute: "2-digit" })}
              </p>
            </>
          ) : (
            <div className="text-sm text-red-400">Clase no encontrada</div>
          )}
        </div>
        <span className="shrink-0 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 text-xs text-emerald-300 font-medium">
          {activeTab === "lista" ? presentCount : scanned.filter((s) => s.status === "ok" || s.status === "warning").length} presentes
        </span>
      </div>

      {/* â”€â”€ Tabs â”€â”€ */}
      <div className="flex border-b border-neutral-800 bg-neutral-900/50">
        <button
          onClick={() => setActiveTab("scanner")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 py-2.5 text-xs font-medium transition-colors border-b-2",
            activeTab === "scanner"
              ? "border-emerald-500 text-emerald-400"
              : "border-transparent text-neutral-500 hover:text-neutral-300"
          )}
        >
          <IconCamera size={15} /> EscÃ¡ner QR
        </button>
        <button
          onClick={() => setActiveTab("lista")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 py-2.5 text-xs font-medium transition-colors border-b-2",
            activeTab === "lista"
              ? "border-emerald-500 text-emerald-400"
              : "border-transparent text-neutral-500 hover:text-neutral-300"
          )}
        >
          <IconList size={15} /> Lista manual
        </button>
      </div>

      {/* â”€â”€ Tab: EscÃ¡ner QR â”€â”€ */}
      {activeTab === "scanner" && (
        <div className="flex-1 overflow-y-auto flex flex-col gap-4 p-4">
          {scannerActive && (
            <div className="relative">
              <QrScannerCamera classId={classId} onScan={handleScanResult} />
              <button
                className="absolute top-2 right-2 rounded-full bg-neutral-900/80 p-1.5 text-neutral-400 hover:text-white"
                onClick={() => setScannerActive(false)}
                title="Ocultar cÃ¡mara"
              >
                <IconX size={16} />
              </button>
            </div>
          )}
          {!scannerActive && (
            <button
              className="w-full rounded-xl border border-neutral-700 py-3 text-sm text-neutral-400 hover:bg-neutral-800 transition-colors"
              onClick={() => setScannerActive(true)}
            >
              Activar cÃ¡mara
            </button>
          )}
          <form onSubmit={handleManualSubmit} className="flex gap-2">
            <input
              type="text"
              value={manualToken}
              onChange={(e) => setManualToken(e.target.value)}
              placeholder="Ingresar token QR manualmenteâ€¦"
              className="flex-1 rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={manualLoading || !manualToken.trim()}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                manualToken.trim() ? "bg-emerald-600 hover:bg-emerald-500 text-white" : "bg-neutral-700 text-neutral-500 cursor-not-allowed"
              )}
            >
              {manualLoading ? "â€¦" : "OK"}
            </button>
          </form>
          {scanned.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">Registro de hoy</h2>
                <button className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors" onClick={() => setScanned([])}>Limpiar</button>
              </div>
              <div ref={listRef} className="space-y-1.5 max-h-64 overflow-y-auto">
                {[...scanned].reverse().map((entry) => (
                  <div key={entry.id} className={cn("flex items-center gap-2.5 rounded-lg border px-3 py-2 text-sm", STATUS_STYLES[entry.status])}>
                    <span className="shrink-0">{STATUS_ICONS[entry.status]}</span>
                    <span className="flex-1 font-medium truncate">{entry.studentName}</span>
                    {entry.message && <span className="shrink-0 text-xs opacity-70">{entry.message}</span>}
                    <span className="shrink-0 text-xs opacity-50 tabular-nums">{entry.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {scanned.length === 0 && !scannerActive && (
            <p className="text-center text-sm text-neutral-600 py-8">Sin registros aÃºn.</p>
          )}
        </div>
      )}

      {/* â”€â”€ Tab: Lista manual â”€â”€ */}
      {activeTab === "lista" && (
        <div className="flex-1 overflow-y-auto flex flex-col">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800/50">
            <p className="text-xs text-neutral-500">
              {rosterLoading ? "Cargandoâ€¦" : `${roster.length} alumnas inscriptas Â· ${presentCount} presentes`}
            </p>
            <button
              onClick={loadRoster}
              disabled={rosterLoading}
              className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-200 transition-colors"
            >
              <IconRefresh size={13} className={rosterLoading ? "animate-spin" : ""} />
              Actualizar
            </button>
          </div>

          {/* Roster list */}
          {rosterLoading && roster.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-sm text-neutral-600">Cargando listaâ€¦</p>
            </div>
          ) : roster.length === 0 ? (
            <div className="flex-1 flex items-center justify-center px-6 text-center">
              <p className="text-sm text-neutral-600">No hay alumnas inscriptas en esta clase.</p>
            </div>
          ) : (
            <ul className="divide-y divide-neutral-800/50">
              {roster.map((entry) => {
                const isToggling = toggling.has(entry.studentId);
                return (
                  <li key={entry.studentId}>
                    <button
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
                        entry.present ? "bg-emerald-950/30 hover:bg-emerald-950/50" : "hover:bg-neutral-900/60"
                      )}
                      onClick={() => toggleAttendance(entry)}
                      disabled={isToggling}
                    >
                      {/* Initials avatar */}
                      <div className={cn(
                        "h-9 w-9 shrink-0 rounded-full flex items-center justify-center text-xs font-bold",
                        entry.present ? "bg-emerald-500/20 text-emerald-400" : "bg-neutral-800 text-neutral-500"
                      )}>
                        {getInitials(entry.name, entry.lastName)}
                      </div>

                      {/* Name */}
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-sm font-medium truncate", entry.present ? "text-white" : "text-neutral-400")}>
                          {entry.name} {entry.lastName}
                        </p>
                        <p className="text-xs text-neutral-600 truncate">{entry.email}</p>
                      </div>

                      {/* Status indicator */}
                      <div className={cn(
                        "shrink-0 h-7 w-7 rounded-full flex items-center justify-center transition-all",
                        isToggling ? "bg-neutral-700" :
                        entry.present ? "bg-emerald-500/20 border border-emerald-500/40" : "border border-neutral-700"
                      )}>
                        {isToggling ? (
                          <IconRefresh size={13} className="text-neutral-500 animate-spin" />
                        ) : entry.present ? (
                          <IconCheck size={13} className="text-emerald-400" />
                        ) : (
                          <IconMinus size={13} className="text-neutral-600" />
                        )}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Summary footer */}
          {roster.length > 0 && (
            <div className="sticky bottom-0 bg-neutral-950 border-t border-neutral-800/50 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-neutral-500">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" />{presentCount} presentes</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-neutral-700" />{roster.length - presentCount} ausentes</span>
              </div>
              <span className="text-xs font-medium text-neutral-400">
                {roster.length > 0 ? Math.round((presentCount / roster.length) * 100) : 0}% asistencia
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
