"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { IconCurrencyDollar, IconGauge, IconRefresh, IconTrendingUp } from "@tabler/icons-react";
import { cn } from "@/util/cn";
import type { FinancialMetrics } from "@/lib/financialMetrics";

interface FetchState<T> {
  status: "idle" | "loading" | "loaded" | "error";
  data: T | null;
  error: string | null;
}

interface MetricTileProps {
  label: string;
  value: string;
  helper?: string;
  icon?: ReactNode;
  accentClass?: string;
}

function MetricTile({ label, value, helper, icon, accentClass }: MetricTileProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-900/70",
        accentClass
      )}
    >
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
        {icon}
        {label}
      </div>
      <p className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">{value}</p>
      {helper && <p className="text-xs text-neutral-500 dark:text-neutral-400">{helper}</p>}
    </div>
  );
}

const chartColors = {
  line: "#10b981",
  average: "#6366f1",
  bar: "#f59e0b",
};

const chartGridColor = {
  strokeDasharray: "4 3",
  stroke: "rgba(148, 163, 184, 0.25)",
};

export function FinancialOverviewPanel() {
  const [state, setState] = useState<FetchState<FinancialMetrics>>({
    status: "idle",
    data: null,
    error: null,
  });

  const loadMetrics = useCallback(async (signal?: AbortSignal) => {
    setState((prev) => ({ ...prev, status: "loading", error: null }));

    try {
      const response = await fetch("/api/dashboard/financials", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
        signal,
      });

      if (!response.ok) {
        throw new Error("No se pudo cargar la información financiera.");
      }

      const payload: FinancialMetrics = await response.json();
      if (signal?.aborted) return;

      setState({ status: "loaded", data: payload, error: null });
    } catch (error) {
      if (signal?.aborted) return;
      console.error("financial overview fetch error", error);
      setState({
        status: "error",
        data: null,
        error: error instanceof Error ? error.message : "Error al cargar los gráficos financieros.",
      });
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void loadMetrics(controller.signal);
    return () => controller.abort();
  }, [loadMetrics]);

  const isLoading = state.status === "idle" || state.status === "loading";

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0,
      }),
    []
  );

  const numberFormatter = useMemo(
    () =>
      new Intl.NumberFormat("es-CL", {
        maximumFractionDigits: 0,
      }),
    []
  );

  const percentFormatter = useMemo(
    () =>
      new Intl.NumberFormat("es-CL", {
        maximumFractionDigits: 1,
        signDisplay: "exceptZero",
      }),
    []
  );

  const monthlyData = useMemo(
    () => state.data?.monthlyRevenueSeries ?? [],
    [state.data?.monthlyRevenueSeries]
  );
  const planBreakdown = useMemo(
    () => state.data?.planRevenueBreakdown ?? [],
    [state.data?.planRevenueBreakdown]
  );

  const kpis = state.data?.kpis;

  const monthOverMonthHelper = useMemo(() => {
    if (!kpis) return "Sin datos de referencia.";
    if (kpis.monthOverMonthPercent === null) {
      return "Sin datos del mes anterior.";
    }
    if (kpis.monthOverMonthDifference === 0) {
      return "Sin variación respecto al mes anterior.";
    }

    const trendArrow = kpis.monthOverMonthDifference > 0 ? "↑" : "↓";
    const trendColor = kpis.monthOverMonthDifference > 0 ? "text-emerald-500" : "text-rose-500";
    return (
      <span className={trendColor}>
        {trendArrow} {currencyFormatter.format(Math.abs(kpis.monthOverMonthDifference))} ({
          percentFormatter.format(kpis.monthOverMonthPercent)
        }) frente al mes previo.
      </span>
    );
  }, [currencyFormatter, kpis, percentFormatter]);

  const topPlanHelper = useMemo(() => {
    if (!kpis?.topPlanType) return "Aún no hay pagos registrados en el periodo.";
    const topPlan = planBreakdown.find((item) => item.planType === kpis.topPlanType);
    if (!topPlan) return null;
    return `${topPlan.planType}: ${currencyFormatter.format(topPlan.total)} en ingresos.`;
  }, [currencyFormatter, kpis?.topPlanType, planBreakdown]);

  return (
    <section className="flex h-full flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-tight text-neutral-500 dark:text-neutral-400">
            Finanzas
          </p>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            Desempeño financiero
          </h2>
          {state.data?.generatedAt && (
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              Actualizado el {new Date(state.data.generatedAt).toLocaleString("es-CL")}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => void loadMetrics()}
          className={cn(
            "inline-flex items-center gap-1 rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800",
            isLoading && "pointer-events-none opacity-60"
          )}
          aria-label="Actualizar datos financieros"
        >
          <IconRefresh className={cn("h-4 w-4", isLoading && "animate-spin")} aria-hidden />
          Actualizar
        </button>
      </header>

      {state.status === "error" && state.error && (
        <div className="rounded-lg border border-rose-500/50 bg-rose-100/50 p-4 text-sm text-rose-700 dark:border-rose-500/40 dark:bg-rose-900/20 dark:text-rose-200">
          {state.error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <MetricTile
          label="Ingresos del mes"
          value={kpis ? currencyFormatter.format(kpis.currentMonthTotal) : isLoading ? "..." : "—"}
          helper={
            kpis
              ? `Promedio por transacción: ${currencyFormatter.format(kpis.currentMonthAverageTicket)}`
              : isLoading
              ? "Calculando promedio..."
              : "Sin pagos registrados."
          }
          icon={<IconCurrencyDollar className="h-4 w-4" aria-hidden />}
          accentClass="border-l-4 border-emerald-500/70"
        />
        <MetricTile
          label="Comparativa mensual"
          value={
            kpis
              ? currencyFormatter.format(kpis.previousMonthTotal)
              : isLoading
              ? "..."
              : "—"
          }
          helper={typeof monthOverMonthHelper === "string" ? monthOverMonthHelper : undefined}
          icon={<IconTrendingUp className="h-4 w-4" aria-hidden />}
          accentClass="border-l-4 border-sky-500/70"
        />
        {typeof monthOverMonthHelper !== "string" && (
          <div className="sm:col-span-2">
            <div className="rounded-lg border border-emerald-200/60 bg-emerald-50/60 p-3 text-xs text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-900/20 dark:text-emerald-200">
              {monthOverMonthHelper}
            </div>
          </div>
        )}
        <MetricTile
          label="Transacciones del mes"
          value={
            kpis
              ? numberFormatter.format(kpis.currentMonthTransactions)
              : isLoading
              ? "..."
              : "0"
          }
          helper="Cantidad total de pagos registrados."
          icon={<IconGauge className="h-4 w-4" aria-hidden />}
          accentClass="border-l-4 border-violet-500/70"
        />
        <MetricTile
          label="Plan con mayor ingreso"
          value={kpis?.topPlanType ?? (isLoading ? "..." : "—")}
          helper={topPlanHelper ?? (isLoading ? "Calculando ingresos..." : "Sin registros de pagos.")}
          accentClass="border-l-4 border-amber-500/70"
        />
      </div>

      <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex h-72 flex-col gap-3 rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900/70">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Ingresos mensuales
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Evolución de los últimos {monthlyData.length} meses.
              </p>
            </div>
          </div>
          <div className="min-h-0 flex-1">
            {isLoading ? (
              <div className="flex h-full items-center justify-center text-sm text-neutral-500 dark:text-neutral-400">
                Cargando gráfico...
              </div>
            ) : monthlyData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-neutral-500 dark:text-neutral-400">
                No hay datos de ingresos registrados.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid {...chartGridColor} />
                  <XAxis dataKey="label" stroke="var(--color-neutral-500)" tick={{ fontSize: 12 }} />
                  <YAxis
                    stroke="var(--color-neutral-500)"
                    tickFormatter={(value: number) =>
                      currencyFormatter.format(value).replace(/\$,?/g, "")
                    }
                    width={70}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{ fontSize: 12 }}
                    formatter={(value: number) => currencyFormatter.format(value)}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line
                    type="monotone"
                    dataKey="total"
                    name="Ingresos"
                    stroke={chartColors.line}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="averageTicket"
                    name="Ticket promedio"
                    stroke={chartColors.average}
                    strokeDasharray="4 3"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="flex h-72 flex-col gap-3 rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900/70">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Ingresos por tipo de plan
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Distribución según pagos registrados en el periodo.
              </p>
            </div>
          </div>
          <div className="min-h-0 flex-1">
            {isLoading ? (
              <div className="flex h-full items-center justify-center text-sm text-neutral-500 dark:text-neutral-400">
                Cargando gráfico...
              </div>
            ) : planBreakdown.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-neutral-500 dark:text-neutral-400">
                No hay pagos asociados a planes en el periodo.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={planBreakdown} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid {...chartGridColor} />
                  <XAxis dataKey="planType" stroke="var(--color-neutral-500)" tick={{ fontSize: 12 }} />
                  <YAxis
                    stroke="var(--color-neutral-500)"
                    tickFormatter={(value: number) =>
                      currencyFormatter.format(value).replace(/\$,?/g, "")
                    }
                    width={70}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(15, 118, 110, 0.12)" }}
                    contentStyle={{ fontSize: 12 }}
                    formatter={(value: number) => currencyFormatter.format(value)}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="total" name="Ingresos" fill={chartColors.bar} radius={4} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
