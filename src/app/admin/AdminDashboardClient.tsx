"use client"
import React, { useState, useEffect, useMemo, useCallback } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { cn } from "@/util/cn";
import { Sidebar, SidebarBody, SidebarLink } from "./components/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconCashRegister,
  IconRefresh,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";
import { PaymentReminderPanel } from "./components/payment-reminder-panel";
import { FinancialOverviewPanel } from "./components/financial-overview-panel";
import { StudentManagementSection } from "./components/student-management-section";
import type { DashboardSummary } from "@/lib/dashboardMetrics";

type SummaryFetchState = "idle" | "loading" | "error" | "loaded";

interface DashboardCardDefinition {
  key: string;
  title: string;
  value: string;
  description: string;
  extra?: string;
  accentClass: string;
}

export function AdminDashboard() {
  const searchParams = useSearchParams();
  const sectionParam = searchParams?.get("section")?.toLowerCase() ?? "dashboard";
  const activeSection = sectionParam === "students" ? "students" : "dashboard";

  const dashboardIconClass = cn(
    "h-5 w-5 shrink-0",
    activeSection === "dashboard"
      ? "text-emerald-600 dark:text-emerald-300"
      : "text-neutral-700 dark:text-neutral-200"
  );
  const studentsIconClass = cn(
    "h-5 w-5 shrink-0",
    activeSection === "students"
      ? "text-emerald-600 dark:text-emerald-300"
      : "text-neutral-700 dark:text-neutral-200"
  );

  const links = [
    {
      label: "Dashboard",
      href: "/admin?section=dashboard",
      isActive: activeSection === "dashboard",
      icon: (
        <IconBrandTabler className={dashboardIconClass} />
      ),
    },
    {
      label: "Inscripción",
      href: "/admin?section=students",
      isActive: activeSection === "students",
      icon: (
        <IconUserBolt className={studentsIconClass} />
      ),
    },
    {
      label: "Configuración",
      href: "#",
      icon: (
        <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
  label: "Pagos",
  href: "/admin/payments",
      icon: (
        <IconCashRegister className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
        {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];

  const [open, setOpen] = useState(false);
  const [adminName, setAdminName] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch('/api/admin/me')
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        if (data.name) setAdminName(data.name);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);
  
  return (
    <div
      className={cn(
        "flex w-full flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
        "h-screen",
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: adminName ?? "Usuario",
                href: "#",
                icon: (
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs font-semibold uppercase text-white dark:bg-emerald-600">
                    {(adminName ?? "U").slice(0, 2)}
                  </span>
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <main className="flex flex-1 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          {activeSection === "dashboard" && (
            <motion.div
              key="dashboard"
              className="flex w-full"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <DashboardOverview />
            </motion.div>
          )}

          {activeSection === "students" && (
            <motion.div
              key="students"
              className="flex w-full"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <StudentManagementSection id="students" variant="page" />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
export const Logo = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <Image src="/tefaremoa.svg" alt="Te Fare Mo'a" width={28} height={28} className="shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black dark:text-white"
      >
        <h3>Te Fare Mo&apos;a <br /> Administración</h3>
      </motion.span>
    </a>
  );
};
export const LogoIcon = () => {
  return (
    <a
  href="#"
  className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
  aria-label="Acet Labs"
    >
      <Image src="/tefaremoa.svg" alt="Te Fare Mo'a" width={28} height={28} className="shrink-0" />
    </a>
  );
};

const DashboardOverview = () => {
  const [summaryState, setSummaryState] = useState<SummaryFetchState>("idle");
  const [summaryData, setSummaryData] = useState<DashboardSummary | null>(null);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const loadSummary = useCallback(async (signal?: AbortSignal) => {
    setSummaryState("loading");
    setSummaryError(null);

    try {
      const response = await fetch("/api/dashboard/summary", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
        signal,
      });

      if (!response.ok) {
        throw new Error("No se pudo obtener el resumen del tablero.");
      }

      const payload: DashboardSummary = await response.json();
      if (signal?.aborted) return;

      setSummaryData(payload);
      setSummaryState("loaded");
    } catch (error) {
      if (signal?.aborted) return;
      console.error("dashboard summary fetch error", error);
      setSummaryError(
        error instanceof Error ? error.message : "Error al cargar el resumen del tablero."
      );
      setSummaryState("error");
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void loadSummary(controller.signal);
    return () => controller.abort();
  }, [loadSummary]);

  const numberFormatter = useMemo(() => new Intl.NumberFormat("es-CL"), []);
  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: summaryData?.stats.monthlyRevenue.currency ?? "CLP",
        maximumFractionDigits: 0,
      }),
    [summaryData?.stats.monthlyRevenue.currency]
  );
  const dateFormatter = useMemo(
    () => new Intl.DateTimeFormat("es-CL", { dateStyle: "medium" }),
    []
  );
  const dateTimeFormatter = useMemo(
    () => new Intl.DateTimeFormat("es-CL", { dateStyle: "medium", timeStyle: "short" }),
    []
  );

  const isSummaryLoading = summaryState === "idle" || summaryState === "loading";

  let cards: DashboardCardDefinition[];
  if (summaryData) {
    const expiring = summaryData.stats.expiringPlans;
    const revenue = summaryData.stats.monthlyRevenue;
    const workshops = summaryData.stats.upcomingWorkshops;

    const nextExpiringLabel = expiring.nextExpiring
      ? expiring.nextExpiring.planEndDate
        ? `${expiring.nextExpiring.name} ${expiring.nextExpiring.lastName ?? ""}`.trim() +
          ` · ${dateFormatter.format(new Date(expiring.nextExpiring.planEndDate))}`
        : `${expiring.nextExpiring.name} ${expiring.nextExpiring.lastName ?? ""}`.trim()
      : `Sin próximas expiraciones en ${expiring.thresholdDays} días.`;

    let revenueTrendText: string;
    if (revenue.trend.percentChange === null) {
      revenueTrendText = "Sin datos del mes anterior.";
    } else if (revenue.trend.difference === 0) {
      revenueTrendText = "Sin variación vs mes anterior.";
    } else {
      const arrow = revenue.trend.difference > 0 ? "↑" : "↓";
      const sign = revenue.trend.percentChange > 0 ? "+" : "";
      revenueTrendText = `${arrow} ${currencyFormatter.format(
        Math.abs(revenue.trend.difference)
      )} (${sign}${revenue.trend.percentChange.toFixed(1)}%) vs mes anterior.`;
    }

    const nextWorkshopInfo = workshops.nextWorkshop
      ? `${workshops.nextWorkshop.name} · ${dateTimeFormatter.format(
          new Date(workshops.nextWorkshop.schedule)
        )}${
          workshops.nextWorkshop.instructorName
            ? ` · ${workshops.nextWorkshop.instructorName}`
            : ""
        }`
      : `No hay talleres próximos en los siguientes ${workshops.horizonDays} días.`;

    cards = [
      {
        key: "active-students",
        title: "Alumnas activas",
        value: numberFormatter.format(summaryData.stats.activeStudents.total),
        description: "Planes vigentes al día de hoy.",
        extra: `Referencia: ${dateFormatter.format(new Date(summaryData.referenceDate))}`,
        accentClass: "border-l-4 border-emerald-500/80",
      },
      {
        key: "expiring-plans",
        title: "Planes por vencer",
        value: numberFormatter.format(expiring.total),
        description: `Renovaciones dentro de ${expiring.thresholdDays} días.`,
        extra: nextExpiringLabel,
        accentClass: "border-l-4 border-amber-500/80",
      },
      {
        key: "monthly-revenue",
        title: "Ingresos del mes",
        value: currencyFormatter.format(revenue.total),
        description: `Transacciones: ${numberFormatter.format(revenue.transactionCount)}.`,
        extra: revenueTrendText,
        accentClass: "border-l-4 border-sky-500/80",
      },
      {
        key: "upcoming-workshops",
        title: "Próximos talleres",
        value: numberFormatter.format(workshops.total),
        description: `Eventos en los próximos ${workshops.horizonDays} días.`,
        extra: nextWorkshopInfo,
        accentClass: "border-l-4 border-violet-500/80",
      },
    ];
  } else {
    cards = [
      {
        key: "active-students",
        title: "Alumnas activas",
        value: isSummaryLoading ? "..." : "—",
        description: isSummaryLoading ? "Cargando datos..." : "Sin datos disponibles.",
        accentClass: "border-l-4 border-emerald-500/40",
      },
      {
        key: "expiring-plans",
        title: "Planes por vencer",
        value: isSummaryLoading ? "..." : "—",
        description: isSummaryLoading ? "Cargando datos..." : "Sin datos disponibles.",
        accentClass: "border-l-4 border-amber-500/40",
      },
      {
        key: "monthly-revenue",
        title: "Ingresos del mes",
        value: isSummaryLoading ? "..." : "—",
        description: isSummaryLoading ? "Cargando datos..." : "Sin datos disponibles.",
        accentClass: "border-l-4 border-sky-500/40",
      },
      {
        key: "upcoming-workshops",
        title: "Próximos talleres",
        value: isSummaryLoading ? "..." : "—",
        description: isSummaryLoading ? "Cargando datos..." : "Sin datos disponibles.",
        accentClass: "border-l-4 border-violet-500/40",
      },
    ];
  }

  return (
    <div className="w-full overflow-y-auto">
      <div className="flex w-full flex-col gap-6 rounded-tl-2xl border border-neutral-200 bg-gray-50 p-4 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
        <section className="flex flex-col gap-4">
          <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-tight text-neutral-500 dark:text-neutral-400">
                Resumen general
              </p>
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                Indicadores del tablero
              </h2>
              {summaryData?.generatedAt && (
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                  Actualizado el {dateTimeFormatter.format(new Date(summaryData.generatedAt))}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              {/* Academy Logo top-right */}
              <div className="hidden sm:block">
                <Image
                  src="/tefaremoa.svg"
                  alt="Te Fare Mo'a"
                  width={36}
                  height={36}
                  className="opacity-90"
                />
              </div>
              <button
              type="button"
              onClick={() => void loadSummary()}
              className={cn(
                "inline-flex items-center gap-1 rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800",
                isSummaryLoading && "pointer-events-none opacity-60"
              )}
              aria-label="Actualizar indicadores del tablero"
            >
              <IconRefresh className={cn("h-4 w-4", isSummaryLoading && "animate-spin")} aria-hidden />
              Actualizar
              </button>
            </div>
          </header>

          {summaryState === "error" && (
            <div className="rounded-lg border border-rose-500/50 bg-rose-100/50 p-4 text-sm text-rose-700 dark:border-rose-500/40 dark:bg-rose-900/20 dark:text-rose-200">
              {summaryError ?? "Error al cargar los indicadores. Intenta nuevamente."}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
              <article
                key={card.key}
                className={cn(
                  "rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-neutral-700 dark:bg-neutral-900/80",
                  card.accentClass,
                  isSummaryLoading && "animate-pulse"
                )}
              >
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  {card.title}
                </h3>
                <p className="mt-3 text-3xl font-semibold text-neutral-900 dark:text-neutral-50">
                  {card.value}
                </p>
                <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300">
                  {card.description}
                </p>
                {card.extra && (
                  <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">{card.extra}</p>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="grid flex-1 grid-cols-1 gap-6 xl:grid-cols-2">
          <PaymentReminderPanel />
          <FinancialOverviewPanel />
        </section>
      </div>
    </div>
  );
};

export default function AdminDashboardClientPage() {
  return <AdminDashboard />;
}
