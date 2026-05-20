"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { cn } from "@/util/cn";
import { Vortex } from "@/app/components/vortex";
import {
  IconMenu2,
  IconX,
  IconUserEdit,
  IconCamera,
  IconHeartPlus,
  IconLogout,
} from "@tabler/icons-react";

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
  Active: { label: "Activo", classes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" },
  ExpiringSoon: { label: "Por vencer", classes: "bg-amber-500/10 text-amber-400 border-amber-500/30" },
  Expired: { label: "Vencido", classes: "bg-red-500/10 text-red-400 border-red-500/30" },
  NoPlan: { label: "Sin plan", classes: "bg-neutral-800 text-neutral-500 border-neutral-700" },
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
  const menuRef = useRef<HTMLDivElement>(null);

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

  // Close menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const logout = async () => {
    try { await fetch("/api/auth/logout", { method: "POST" }); } finally {
      router.push("/admin/student-login");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/tefaremoa.svg" alt="Te Fare Mo'a" className="h-10 w-auto opacity-40 animate-pulse" />
          <p className="text-neutral-600 text-xs tracking-widest uppercase">Cargando…</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black px-4">
        <div className="w-full max-w-md rounded-2xl bg-neutral-900 border border-neutral-800/60 p-6 shadow-2xl">
          <h1 className="text-lg font-semibold text-white mb-1">Acceso requerido</h1>
          <p className="text-sm text-neutral-400 mb-4">{error || "No autorizado"}</p>
          <Button className="w-full" onClick={() => router.push("/admin/student-login")}>Ir a login</Button>
        </div>
      </div>
    );
  }

  const planStyle = PLAN_STATUS_STYLES[data.plan.status] ?? PLAN_STATUS_STYLES.NoPlan;
  const missingFields = Object.entries(data.profile.fields).filter(([, v]) => !v).map(([k]) => k);

  return (
    <div className="min-h-screen bg-black">

      {/* ── Hamburger menu ── */}
      <div ref={menuRef} className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-black/80 backdrop-blur border border-orange-500/20 text-white shadow-lg transition hover:border-orange-500/50"
          aria-label="Menú"
        >
          {menuOpen ? <IconX size={18} /> : <IconMenu2 size={18} />}
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-neutral-950 border border-neutral-800/60 shadow-2xl overflow-hidden">
            <button
              className="flex w-full items-center gap-3 px-4 py-3 text-sm text-neutral-300 hover:bg-neutral-900 transition-colors"
              onClick={() => { setMenuOpen(false); router.push("/admin/student-profile"); }}
            >
              <IconUserEdit size={15} className="text-orange-500/70 shrink-0" /> Editar perfil
            </button>
            <button
              className="flex w-full items-center gap-3 px-4 py-3 text-sm text-neutral-300 hover:bg-neutral-900 transition-colors border-t border-neutral-800/40"
              onClick={() => { setMenuOpen(false); router.push("/admin/student-photo"); }}
            >
              <IconCamera size={15} className="text-orange-500/70 shrink-0" /> Foto de perfil
            </button>
            <button
              className="flex w-full items-center gap-3 px-4 py-3 text-sm text-neutral-300 hover:bg-neutral-900 transition-colors border-t border-neutral-800/40"
              onClick={() => { setMenuOpen(false); router.push("/admin/student-anamnesis"); }}
            >
              <IconHeartPlus size={15} className="text-orange-500/70 shrink-0" /> Ficha de salud
            </button>
            <button
              className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-400/80 hover:bg-neutral-900 transition-colors border-t border-neutral-800/40"
              onClick={() => { setMenuOpen(false); logout(); }}
            >
              <IconLogout size={15} className="shrink-0" /> Cerrar sesión
            </button>
          </div>
        )}
      </div>

      {/* ── Header Vortex ── */}
      <Vortex
        particleCount={150}
        baseHue={10}
        rangeHue={20}
        baseSpeed={0}
        rangeSpeed={0.4}
        backgroundColor="#000000"
        containerClassName="bg-black"
      >
        <div className="flex flex-col items-center gap-3 text-center pt-10 pb-10 px-4">
          {/* Logo academia */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/tefaremoa.svg" alt="Te Fare Mo'a" className="h-9 w-auto opacity-60 mb-1" />

          {/* Avatar con borde degradado naranja */}
          <div className="p-[3px] rounded-full shrink-0" style={{ background: 'linear-gradient(135deg, #f97316 0%, #000000 50%, #f97316 100%)' }}>
            <div className="h-24 w-24 rounded-full overflow-hidden bg-neutral-950">
              {photoOk ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoSrc} alt="Foto" className="h-full w-full object-cover" onError={() => setPhotoOk(false)} />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-white text-2xl font-bold">
                  {initials || "A"}
                </div>
              )}
            </div>
          </div>

          {/* Nombre y email */}
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">{data.name} {data.lastName}</h1>
            <p className="text-xs text-neutral-500 mt-0.5">{data.email}</p>
          </div>

          {/* Badge plan */}
          <span className={cn("rounded-full border px-3 py-1 text-xs font-medium", planStyle.classes)}>
            {planStyle.label}
          </span>
        </div>
      </Vortex>

      {/* Separador sutil */}
      <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, #f97316 30%, #f97316 70%, transparent)' }} />

      {/* ── Contenido ── */}
      <div className="mx-auto w-full max-w-2xl px-4 py-7 space-y-4">

        {/* ── Plan ── */}
        <div className="rounded-2xl bg-neutral-950 border border-neutral-800/50 p-5">
          <h2 className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-4">
            <span className="h-px w-4 rounded-full bg-orange-500" />Mi Plan
          </h2>
          <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <div>
              <p className="text-neutral-600 text-xs mb-0.5">Tipo</p>
              <p className="text-white font-medium">{data.plan.type}</p>
            </div>
            <div>
              <p className="text-neutral-600 text-xs mb-0.5">Inicio</p>
              <p className="text-white font-medium">{formatDate(data.plan.startDate)}</p>
            </div>
            <div>
              <p className="text-neutral-600 text-xs mb-0.5">Vencimiento</p>
              <p className={cn("font-medium", data.plan.status === "Expired" ? "text-red-400" : data.plan.status === "ExpiringSoon" ? "text-amber-400" : "text-white")}>
                {formatDate(data.plan.endDate)}
              </p>
            </div>
          </div>
        </div>

        {/* ── Clases inscriptas ── */}
        <div className="rounded-2xl bg-neutral-950 border border-neutral-800/50 p-5">
          <h2 className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-4">
            <span className="h-px w-4 rounded-full bg-orange-500" />Mis Clases
            <span className="ml-auto rounded-full bg-neutral-900 border border-neutral-800 px-2 py-0.5 text-[10px] text-neutral-500 font-normal normal-case tracking-normal">{data.enrollments.length}</span>
          </h2>
          {data.enrollments.length === 0 ? (
            <p className="text-sm text-neutral-600">Aún no estás inscripta en ninguna clase.</p>
          ) : (
            <ul className="space-y-2">
              {data.enrollments.map((e) => (
                <li key={e.id} className="rounded-xl bg-neutral-900/60 border border-neutral-800/30 px-4 py-3">
                  <p className="text-sm font-medium text-white">{e.className}</p>
                  <p className="text-xs text-neutral-500 capitalize mt-0.5">{formatSchedule(e.schedule)}</p>
                  {e.instructorName && (
                    <p className="text-xs text-neutral-700 mt-0.5">Prof. {e.instructorName}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ── Pagos recientes ── */}
        {data.payments.length > 0 && (
          <div className="rounded-2xl bg-neutral-950 border border-neutral-800/50 p-5">
            <h2 className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-4">
              <span className="h-px w-4 rounded-full bg-orange-500" />Pagos recientes
            </h2>
            <ul className="divide-y divide-neutral-900">
              {data.payments.map((p) => (
                <li key={p.id} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="text-neutral-600 text-xs">{formatDate(p.date)}</span>
                  <span className="font-semibold text-orange-400 tabular-nums">{formatAmount(p.amount)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── Completeness ── */}
        {data.profile.completenessPercent < 100 && (
          <div className="rounded-2xl bg-neutral-950 border border-neutral-800/50 p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-widest">
                <span className="h-px w-4 rounded-full bg-orange-500" />Completar perfil
              </h2>
              <span className="text-xs font-semibold text-orange-400">{data.profile.completenessPercent}%</span>
            </div>
            {/* Barra de progreso con degradado naranja */}
            <div className="h-1.5 w-full rounded-full bg-neutral-900 border border-neutral-800/40 mb-4 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${data.profile.completenessPercent}%`,
                  background: 'linear-gradient(90deg, #92400e 0%, #f97316 60%, #fb923c 100%)',
                  boxShadow: '0 0 8px rgba(249,115,22,0.5)',
                }}
              />
            </div>
            <ul className="flex flex-wrap gap-1.5">
              {missingFields.map((f) => (
                <li key={f} className="rounded-lg bg-neutral-900 border border-neutral-800/50 px-2.5 py-1 text-xs text-neutral-500">
                  {COMPLETENESS_LABELS[f] ?? f}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── Mi QR ── */}
        <div className="rounded-2xl bg-neutral-950 border border-neutral-800/50 p-5">
          <h2 className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-1">
            <span className="h-px w-4 rounded-full bg-orange-500" />Mi QR de asistencia
          </h2>
          <p className="text-xs text-neutral-700 mb-5">Presentá este código en clase para registrar tu asistencia.</p>
          {/* Marco con degradado naranja */}
          <div className="mx-auto w-fit p-[3px] rounded-2xl" style={{ background: 'linear-gradient(135deg, #f97316, #000000 50%, #f97316)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/api/student/qr"
              alt="Mi código QR"
              className="w-48 h-48 rounded-xl bg-white p-2 block"
            />
          </div>
          <a
            href="/api/student/qr"
            download="mi-qr-tefaremoa.png"
            className="mt-4 block text-center text-xs text-neutral-600 hover:text-orange-500 transition-colors"
          >
            Descargar imagen
          </a>
        </div>

        {/* Firma discreta */}
        <p className="text-center text-[10px] text-neutral-800 pb-4 tracking-widest uppercase">Te Fare Mo&apos;a</p>

      </div>
    </div>
  );
}

