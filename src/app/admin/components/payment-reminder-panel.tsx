"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { IconAlertTriangle, IconCash, IconRefresh, IconUsers } from "@tabler/icons-react";
import { cn } from "@/util/cn";
import type { PaymentReminderResult, PaymentReminderStudent } from "@/lib/paymentReminders";

interface SectionConfig {
  title: string;
  icon: ReactNode;
  emptyMessage: string;
  highlightClass: string;
  data: PaymentReminderStudent[];
}

type FetchState = "idle" | "loading" | "error" | "loaded";

export function PaymentReminderPanel() {
  const [state, setState] = useState<FetchState>("idle");
  const [data, setData] = useState<PaymentReminderResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadData = async () => {
    setState("loading");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/alerts/payment-reminders", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("No se pudo cargar la información de recordatorios de pago.");
      }

      const payload: PaymentReminderResult = await response.json();
      setData(payload);
      setState("loaded");
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error instanceof Error ? error.message : "Error al cargar los recordatorios de pago."
      );
      setState("error");
    }
  };

  useEffect(() => {
    if (state === "idle") {
      void loadData();
    }
  }, [state]);

  const sections: SectionConfig[] = useMemo(() => {
    return [
      {
        title: "Por cobrar",
        icon: <IconCash className="h-4 w-4 text-amber-600" aria-hidden />,
        emptyMessage: "Todas las alumnas registraron su pago de este mes.",
        highlightClass: "border-amber-400/50 bg-amber-50/80 dark:border-amber-500/40 dark:bg-amber-900/20",
        data: data?.students.pending ?? [],
      },
      {
        title: "Vencidas",
        icon: <IconAlertTriangle className="h-4 w-4 text-rose-600" aria-hidden />,
        emptyMessage: "No hay adeudos pendientes. ¡Excelente!",
        highlightClass: "border-rose-400/50 bg-rose-50/80 dark:border-rose-500/40 dark:bg-rose-900/20",
        data: data?.students.overdue ?? [],
      },
    ];
  }, [data]);

  const isLoading = state === "idle" || state === "loading";

  return (
    <section className="flex h-full flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-tight text-neutral-500 dark:text-neutral-400">
            Recordatorios de pago
          </p>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            Estatus mensual
          </h2>
          {data?.generatedAt && (
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              Actualizado el {new Date(data.generatedAt).toLocaleString()}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => void loadData()}
          className={cn(
            "inline-flex items-center gap-1 rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800",
            isLoading && "pointer-events-none opacity-60"
          )}
          aria-label="Actualizar recordatorios de pago"
        >
          <IconRefresh className={cn("h-4 w-4", isLoading && "animate-spin")} aria-hidden />
          Actualizar
        </button>
      </header>

      {state === "error" && (
        <div className="rounded-lg border border-rose-500/50 bg-rose-100/50 p-4 text-sm text-rose-700 dark:border-rose-500/40 dark:bg-rose-900/20 dark:text-rose-200">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-emerald-200/60 bg-emerald-50/60 p-4 dark:border-emerald-500/40 dark:bg-emerald-900/10">
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-200">
            <IconUsers className="h-4 w-4" aria-hidden />
            Resumen
          </div>
          <dl className="mt-3 grid grid-cols-2 gap-4">
            <div>
              <dt className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                Por cobrar
              </dt>
              <dd className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {data?.totals.pending ?? "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                Vencidas
              </dt>
              <dd className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {data?.totals.overdue ?? "—"}
              </dd>
            </div>
          </dl>
          {data?.dueDate && (
            <p className="mt-3 text-xs text-neutral-600 dark:text-neutral-400">
              Fecha límite del mes: {new Date(data.dueDate).toLocaleDateString()}
            </p>
          )}
        </div>

        <div className="flex items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-center text-sm text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
          <p>
            Configura mensajes automáticos o exporta la información para comunicar recordatorios a tus alumnas.
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 overflow-hidden">
        {sections.map((section) => (
          <article
            key={section.title}
            className={cn(
              "flex min-h-[140px] flex-col gap-3 rounded-lg border p-4 transition",
              section.highlightClass,
              isLoading && "animate-pulse"
            )}
          >
            <header className="flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              {section.icon}
              {section.title}
              {!isLoading && (
                <span className="rounded-full bg-neutral-900/5 px-2 py-0.5 text-xs font-medium text-neutral-600 dark:bg-neutral-100/10 dark:text-neutral-200">
                  {section.data.length}
                </span>
              )}
            </header>

            {isLoading && (
              <div className="flex flex-1 items-center justify-center text-sm text-neutral-500 dark:text-neutral-400">
                Cargando...
              </div>
            )}

            {!isLoading && section.data.length === 0 && (
              <p className="text-sm text-neutral-600 dark:text-neutral-300">{section.emptyMessage}</p>
            )}

            {!isLoading && section.data.length > 0 && (
              <ul className="flex flex-col gap-2 overflow-y-auto pr-1 text-sm">
                {section.data.map((student) => (
                  <li
                    key={student.id}
                    className="flex items-start justify-between gap-3 rounded-lg border border-neutral-900/5 bg-white/60 p-3 text-neutral-700 shadow-sm dark:border-neutral-100/10 dark:bg-neutral-900/50 dark:text-neutral-200"
                  >
                    <div>
                      <p className="font-medium">
                        {student.name} {student.lastName ?? ""}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {student.email}
                      </p>
                    </div>
                    <div className="shrink-0 text-right text-xs text-neutral-600 dark:text-neutral-300">
                      {typeof student.daysUntilDue === "number" && (
                        <span className="font-semibold">
                          {student.daysUntilDue} días restantes
                        </span>
                      )}
                      {typeof student.daysOverdue === "number" && (
                        <span className="font-semibold text-rose-600 dark:text-rose-300">
                          {student.daysOverdue} días vencidos
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
