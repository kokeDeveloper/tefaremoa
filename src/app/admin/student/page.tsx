"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { cn } from "@/util/cn";

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
    <div className="min-h-screen bg-neutral-900 px-4 py-8">
      <div className="mx-auto w-full max-w-2xl space-y-5">

        {/* ── Header ── */}
        <div className="rounded-xl bg-neutral-800 p-5 shadow flex items-center gap-4">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-neutral-700">
            {photoOk ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photoSrc} alt="Foto" className="h-full w-full object-cover" onError={() => setPhotoOk(false)} />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-white text-lg font-semibold">
                {initials || "A"}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-semibold text-white truncate">{data.name} {data.lastName}</h1>
            <p className="text-sm text-neutral-400 truncate">{data.email}</p>
          </div>
          <span className={cn("shrink-0 rounded-full border px-3 py-1 text-xs font-medium", planStyle.classes)}>
            {planStyle.label}
          </span>
        </div>

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
                  <span className="font-medium text-emerald-400">{formatAmount(p.amount)}</span>
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
                className="h-1.5 rounded-full bg-emerald-500 transition-all"
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

        {/* ── Acciones ── */}
        <div className="grid gap-2 sm:grid-cols-2">
          <Button className="w-full bg-neutral-700 text-neutral-100 hover:bg-neutral-600" onClick={() => router.push("/admin/student-profile")}>
            Editar perfil
          </Button>
          <Button className="w-full bg-neutral-700 text-neutral-100 hover:bg-neutral-600" onClick={() => router.push("/admin/student-photo")}>
            Foto de perfil
          </Button>
          <Button className="w-full bg-neutral-700 text-neutral-100 hover:bg-neutral-600" onClick={() => router.push("/admin/student-anamnesis")}>
            Ficha de salud
          </Button>
          <Button className="w-full" onClick={logout}>
            Cerrar sesión
          </Button>
        </div>

      </div>
    </div>
  );
}

