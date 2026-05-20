"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { cn } from "@/util/cn";
import { IconMenu2, IconX, IconUserEdit, IconCamera, IconHeartRateMonitor, IconLogout } from "@tabler/icons-react";


export const dynamic = "force-dynamic";

// ── Types ──────────────────────────────────────────────────────────────────────

type DashboardData = {
  id: number;
  name: string;
  lastName: string;
  email: string;
  hasPhoto: boolean;
  hasAnamnesis: boolean;
  plan: {
    type: string;
    status: string;
    startDate: string | null;
    endDate: string | null;
  };
  enrollments: {
    id: number;
    classId: number;
    className: string;
    schedule: string;
    instructorName: string | null;
    capacity: number;
  }[];
  payments: {
    id: number;
    amount: number;
    date: string;
  }[];
  profile: {
    completenessPercent: number;
    fields: Record<string, boolean>;
  };
};

// ── Helpers ────────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const second = parts.length > 1 ? parts[1]?.[0] ?? "" : parts[0]?.[1] ?? "";
  return (first + second).toUpperCase();
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-CL", { day: "2-digit", month: "short", year: "numeric" });
}

function formatSchedule(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("es-CL", { weekday: "long", hour: "2-digit", minute: "2-digit" });
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(amount);
}

const PLAN_STATUS_STYLES: Record<string, { label: string; classes: string }> = {
  Active: { label: "Activo", classes: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" },
  ExpiringSoon: { label: "Por vencer", classes: "bg-amber-500/20 text-amber-300 border-amber-500/40" },
  Expired: { label: "Vencido", classes: "bg-red-500/20 text-red-300 border-red-500/40" },
  NoPlan: { label: "Sin plan", classes: "bg-neutral-500/20 text-neutral-400 border-neutral-500/40" },
};

const COMPLETENESS_LABELS: Record<string, string> = {
  phone: "Teléfono",
  nickname: "Apodo",
  address: "Dirección",
  city: "Ciudad",
  birthDate: "Fecha de nacimiento",
  photo: "Foto de perfil",
  anamnesis: "Ficha de salud",
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function StudentIndexPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);
  const [photoOk, setPhotoOk] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch("/api/student/dashboard", { credentials: "include" });
        const json = await res.json().catch(() => ({}));
        if (!mounted) return;
        if (!res.ok) throw new Error(json?.error || "No autorizado");
        setData(json as DashboardData);
        // Redirect to anamnesis if not filled
        if (!json.hasAnamnesis) {
          router.replace("/admin/student-anamnesis");
          return;
        }
      } catch (err: any) {
        if (!mounted) return;
        setError(err?.message || "No autorizado");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [router]);

  const initials = useMemo(() => getInitials(data?.name || ""), [data?.name]);
  const photoSrc = useMemo(() => `/api/student/profile-photo?t=${Date.now()}`, []);

  const logout = async () => {
    try { await fetch("/api/auth/logout", { method: "POST" }); } finally {
      router.push("/admin/student-login");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-900">
        <div className="text-neutral-400 text-sm">Cargando…</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-900 px-4">
        <div className="w-full max-w-md rounded-xl bg-neutral-800 p-6 shadow-lg">
          <h1 className="text-lg font-semibold text-white mb-1">Acceso requerido</h1>
          <p className="text-sm text-neutral-300 mb-4">{error || "No autorizado"}</p>
          <Button className="w-full" onClick={() => router.push("/admin/student-login")}>Ir a login</Button>
        </div>
      </div>
    );
  }

  const planStyle = PLAN_STATUS_STYLES[data.plan.status] ?? PLAN_STATUS_STYLES.NoPlan;
  const missingFields = Object.entries(data.profile.fields).filter(([, v]) => !v).map(([k]) => k);

  return (
    <div className="min-h-screen bg-neutral-900">

      {/* ── Header full-bleed ── */}
      <div className="bg-neutral-900">
        <div className="flex flex-col items-center gap-3 text-center pt-12 pb-8 px-4">
          {/* Avatar */}
          <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full ring-4 ring-orange-500/70 bg-neutral-700 shadow-lg">
            {photoOk ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photoSrc} alt="Foto" className="h-full w-full object-cover" onError={() => setPhotoOk(false)} />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-white text-2xl font-bold">
                {initials || "A"}
              </div>
            )}
          </div>
          {/* Nombre y email */}
          <div>
            <h1 className="text-xl font-bold text-white drop-shadow">{data.name} {data.lastName}</h1>
            <p className="text-sm text-neutral-300 mt-0.5">{data.email}</p>
          </div>
          {/* Badge plan */}
          <span className={cn("rounded-full border px-3 py-1 text-xs font-medium", planStyle.classes)}>
            {planStyle.label}
          </span>
        </div>
      </div>

      {/* ── Contenido ── */}
      <div className="mx-auto w-full max-w-2xl px-4 py-6 space-y-5">

        {/* ── Plan ── */}
        <div className="rounded-xl bg-neutral-800 p-5 shadow">
          <h2 className="text-sm font-semibold text-neutral-300 uppercase tracking-wide mb-3">Mi Plan</h2>
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
            <div>
              <span className="text-neutral-500">Tipo</span>
              <p className="text-white font-medium">{data.plan.type}</p>
            </div>
            <div>
              <span className="text-neutral-500">Inicio</span>
              <p className="text-white font-medium">{formatDate(data.plan.startDate)}</p>
            </div>
            <div>
              <span className="text-neutral-500">Vencimiento</span>
              <p className={cn("font-medium", data.plan.status === "Expired" ? "text-red-400" : data.plan.status === "ExpiringSoon" ? "text-amber-400" : "text-white")}>
                {formatDate(data.plan.endDate)}
              </p>
            </div>
          </div>
        </div>

        {/* ── Clases inscriptas ── */}
        <div className="rounded-xl bg-neutral-800 p-5 shadow">
          <h2 className="text-sm font-semibold text-neutral-300 uppercase tracking-wide mb-3">
            Mis Clases
            <span className="ml-2 rounded-full bg-neutral-700 px-2 py-0.5 text-xs text-neutral-300">{data.enrollments.length}</span>
          </h2>
          {data.enrollments.length === 0 ? (
            <p className="text-sm text-neutral-500">Aún no estás inscripta en ninguna clase.</p>
          ) : (
            <ul className="space-y-2">
              {data.enrollments.map((e) => (
                <li key={e.id} className="rounded-lg bg-neutral-700/60 px-4 py-3">
                  <p className="text-sm font-medium text-white">{e.className}</p>
                  <p className="text-xs text-neutral-400 capitalize">{formatSchedule(e.schedule)}</p>
                  {e.instructorName && (
                    <p className="text-xs text-neutral-500 mt-0.5">Prof. {e.instructorName}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ── Pagos recientes ── */}
        {data.payments.length > 0 && (
          <div className="rounded-xl bg-neutral-800 p-5 shadow">
            <h2 className="text-sm font-semibold text-neutral-300 uppercase tracking-wide mb-3">Pagos recientes</h2>
            <ul className="divide-y divide-neutral-700/60">
              {data.payments.map((p) => (
                <li key={p.id} className="flex items-center justify-between py-2 text-sm">
                  <span className="text-neutral-400">{formatDate(p.date)}</span>
                  <span className="font-medium text-orange-400">{formatAmount(p.amount)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── Completeness ── */}
        {data.profile.completenessPercent < 100 && (
          <div className="rounded-xl bg-neutral-800 p-5 shadow">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-neutral-300 uppercase tracking-wide">Completar perfil</h2>
              <span className="text-xs text-neutral-400">{data.profile.completenessPercent}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-neutral-700 mb-3">
              <div
                className="h-1.5 rounded-full bg-orange-500 transition-all"
                style={{ width: `${data.profile.completenessPercent}%` }}
              />
            </div>
            <p className="text-xs text-neutral-500 mb-1">Falta completar:</p>
            <ul className="flex flex-wrap gap-1.5">
              {missingFields.map((f) => (
                <li key={f} className="rounded-md bg-neutral-700 px-2 py-0.5 text-xs text-neutral-400">
                  {COMPLETENESS_LABELS[f] ?? f}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── Mi QR ── */}
        <div className="rounded-xl bg-neutral-800 p-5 shadow">
          <h2 className="text-sm font-semibold text-neutral-300 uppercase tracking-wide mb-3">Mi QR de asistencia</h2>
          <p className="text-xs text-neutral-500 mb-4">Presentá este código en clase para registrar tu asistencia.</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/api/student/qr"
            alt="Mi código QR"
            className="mx-auto w-48 h-48 rounded-lg bg-white p-1"
          />
          <a
            href="/api/student/qr"
            download="mi-qr-tefaremoa.png"
            className="mt-3 block text-center text-xs text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            Descargar imagen
          </a>
        </div>

        {/* ── Spacer para el menú flotante ── */}
        <div className="h-20" />

      </div>

      {/* ── Menú sandwich flotante ── */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        {menuOpen && (
          <div className="flex flex-col gap-2 mb-2 animate-in slide-in-from-bottom-4 duration-200">
            <button
              onClick={() => { setMenuOpen(false); router.push("/admin/student-profile"); }}
              className="flex items-center gap-3 rounded-2xl bg-neutral-700 px-4 py-3 text-sm text-white shadow-lg hover:bg-neutral-600 transition-colors"
            >
              <IconUserEdit size={18} />
              Editar perfil
            </button>
            <button
              onClick={() => { setMenuOpen(false); router.push("/admin/student-photo"); }}
              className="flex items-center gap-3 rounded-2xl bg-neutral-700 px-4 py-3 text-sm text-white shadow-lg hover:bg-neutral-600 transition-colors"
            >
              <IconCamera size={18} />
              Foto de perfil
            </button>
            <button
              onClick={() => { setMenuOpen(false); router.push("/admin/student-anamnesis"); }}
              className="flex items-center gap-3 rounded-2xl bg-neutral-700 px-4 py-3 text-sm text-white shadow-lg hover:bg-neutral-600 transition-colors"
            >
              <IconHeartRateMonitor size={18} />
              Ficha de salud
            </button>
            <button
              onClick={() => { setMenuOpen(false); logout(); }}
              className="flex items-center gap-3 rounded-2xl bg-red-700 px-4 py-3 text-sm text-white shadow-lg hover:bg-red-600 transition-colors"
            >
              <IconLogout size={18} />
              Cerrar sesión
            </button>
          </div>
        )}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 shadow-xl hover:bg-orange-400 transition-colors text-white"
          aria-label="Menú"
        >
          {menuOpen ? <IconX size={24} /> : <IconMenu2 size={24} />}
        </button>
      </div>

    </div>
  );
}

