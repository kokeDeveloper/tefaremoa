"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/util/cn";
import { IconArrowLeft, IconQrcode, IconUserCheck, IconAlertTriangle, IconX } from "@tabler/icons-react";

export const dynamicPage = "force-dynamic";

const QrScannerCamera = dynamic(() => import("./QrScannerCamera"), { ssr: false });

// ── Types ──────────────────────────────────────────────────────────────────────

type ClassInfo = { id: number; name: string; schedule: string };

type ScannedEntry = {
  id: string; // local unique key
  studentName: string;
  time: string;
  status: "ok" | "duplicate" | "error" | "warning";
  message?: string;
};

// ── Helpers ────────────────────────────────────────────────────────────────────

function nowTime() {
  return new Date().toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ScannerPage() {
  const params = useParams();
  const router = useRouter();
  const classId = Number(params.classId);

  const [classInfo, setClassInfo] = useState<ClassInfo | null>(null);
  const [loadingClass, setLoadingClass] = useState(true);
  const [scanned, setScanned] = useState<ScannedEntry[]>([]);
  const [manualToken, setManualToken] = useState("");
  const [manualLoading, setManualLoading] = useState(false);
  const [scannerActive, setScannerActive] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);

  // Load class info
  useEffect(() => {
    if (!classId) return;
    fetch(`/api/classes/${classId}`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setClassInfo({ id: d.id, name: d.name, schedule: d.schedule }))
      .catch(() => {})
      .finally(() => setLoadingClass(false));
  }, [classId]);

  // Scroll log to bottom on new entries
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [scanned]);

  function addEntry(entry: Omit<ScannedEntry, "id" | "time">) {
    setScanned((prev) => [
      ...prev,
      { ...entry, id: Math.random().toString(36).slice(2), time: nowTime() },
    ]);
  }

  function handleScanResult(result: { ok: boolean; studentName: string; alreadyRecorded?: boolean; notEnrolled?: boolean; error?: string }) {
    if (result.ok) {
      addEntry({
        studentName: result.studentName,
        status: result.notEnrolled ? "warning" : "ok",
        message: result.notEnrolled ? "Asistencia registrada (sin inscripción activa)" : undefined,
      });
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
        addEntry({
          studentName: `${data.student.name} ${data.student.lastName}`,
          status: data.notEnrolled ? "warning" : "ok",
          message: data.notEnrolled ? "Sin inscripción activa" : undefined,
        });
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

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col">
      {/* Header */}
      <div className="bg-neutral-900 border-b border-neutral-800 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="text-neutral-400 hover:text-white transition-colors"
        >
          <IconArrowLeft size={20} />
        </button>
        <div className="min-w-0 flex-1">
          {loadingClass ? (
            <div className="text-sm text-neutral-400">Cargando clase…</div>
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
          {scanned.filter((s) => s.status === "ok" || s.status === "warning").length} presentes
        </span>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col gap-4 p-4">
        {/* Camera scanner */}
        {scannerActive && (
          <div className="relative">
            <QrScannerCamera classId={classId} onScan={handleScanResult} />
            <button
              className="absolute top-2 right-2 rounded-full bg-neutral-900/80 p-1.5 text-neutral-400 hover:text-white"
              onClick={() => setScannerActive(false)}
              title="Ocultar cámara"
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
            Activar cámara
          </button>
        )}

        {/* Manual entry */}
        <form onSubmit={handleManualSubmit} className="flex gap-2">
          <input
            type="text"
            value={manualToken}
            onChange={(e) => setManualToken(e.target.value)}
            placeholder="Ingresar token QR manualmente…"
            className="flex-1 rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={manualLoading || !manualToken.trim()}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              manualToken.trim()
                ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                : "bg-neutral-700 text-neutral-500 cursor-not-allowed"
            )}
          >
            {manualLoading ? "…" : "OK"}
          </button>
        </form>

        {/* Scanned log */}
        {scanned.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">Registro de hoy</h2>
              <button
                className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors"
                onClick={() => setScanned([])}
              >
                Limpiar
              </button>
            </div>
            <div ref={listRef} className="space-y-1.5 max-h-64 overflow-y-auto">
              {[...scanned].reverse().map((entry) => (
                <div
                  key={entry.id}
                  className={cn("flex items-center gap-2.5 rounded-lg border px-3 py-2 text-sm", STATUS_STYLES[entry.status])}
                >
                  <span className="shrink-0">{STATUS_ICONS[entry.status]}</span>
                  <span className="flex-1 font-medium truncate">{entry.studentName}</span>
                  {entry.message && (
                    <span className="shrink-0 text-xs opacity-70">{entry.message}</span>
                  )}
                  <span className="shrink-0 text-xs opacity-50 tabular-nums">{entry.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {scanned.length === 0 && !scannerActive && (
          <p className="text-center text-sm text-neutral-600 py-8">Sin registros aún. Activá la cámara o ingresá un token.</p>
        )}
      </div>
    </div>
  );
}
