import type { PrismaClient } from "../app/generated/prisma";

export interface MonthlyRevenuePoint {
  monthKey: string;
  label: string;
  total: number;
  transactions: number;
  averageTicket: number;
}

export interface PlanRevenueBreakdownItem {
  planType: string;
  total: number;
  transactions: number;
}

export interface FinancialMetrics {
  generatedAt: string;
  seriesStart: string;
  seriesEnd: string;
  monthlyRevenueSeries: MonthlyRevenuePoint[];
  planRevenueBreakdown: PlanRevenueBreakdownItem[];
  kpis: {
    currentMonthTotal: number;
    currentMonthTransactions: number;
    currentMonthAverageTicket: number;
    previousMonthTotal: number;
    monthOverMonthDifference: number;
    monthOverMonthPercent: number | null;
    topPlanType: string | null;
  };
}

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function getMonthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function getMonthLabel(date: Date) {
  return date.toLocaleDateString("es-CL", {
    month: "short",
    year: "numeric",
  });
}

export async function getFinancialMetrics(
  prisma: PrismaClient,
  options: { referenceDate?: Date; months?: number } = {}
): Promise<FinancialMetrics> {
  const { referenceDate = new Date(), months = 6 } = options;

  const now = referenceDate;
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const seriesStart = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);
  const seriesEnd = nextMonthStart;

  const paymentsInSeries = await prisma.payment.findMany({
    where: {
      date: {
        gte: seriesStart,
        lt: seriesEnd,
      },
    },
    select: {
      amount: true,
      date: true,
      student: {
        select: {
          planType: true,
        },
      },
    },
  });

  const monthlyMap = new Map<string, MonthlyRevenuePoint>();
  for (let i = 0; i < months; i += 1) {
    const date = new Date(seriesStart.getFullYear(), seriesStart.getMonth() + i, 1);
    const key = getMonthKey(date);
    monthlyMap.set(key, {
      monthKey: key,
      label: getMonthLabel(date),
      total: 0,
      transactions: 0,
      averageTicket: 0,
    });
  }

  const planMap = new Map<string, { total: number; transactions: number }>();

  paymentsInSeries.forEach((payment) => {
    const paymentDate = new Date(payment.date);
    const key = getMonthKey(paymentDate);
    const monthEntry = monthlyMap.get(key);
    if (monthEntry) {
      monthEntry.total += payment.amount;
      monthEntry.transactions += 1;
    }

    const planType = payment.student?.planType ?? "Sin plan";
    const planEntry = planMap.get(planType) ?? { total: 0, transactions: 0 };
    planEntry.total += payment.amount;
    planEntry.transactions += 1;
    planMap.set(planType, planEntry);
  });

  const monthlyRevenueSeries = Array.from(monthlyMap.values()).map((item) => ({
    ...item,
    averageTicket: item.transactions > 0 ? item.total / item.transactions : 0,
  }));

  const planRevenueBreakdown: PlanRevenueBreakdownItem[] = Array.from(planMap.entries())
    .map(([planType, values]) => ({
      planType,
      total: values.total,
      transactions: values.transactions,
    }))
    .sort((a, b) => b.total - a.total);

  const currentMonthPoint = monthlyMap.get(getMonthKey(currentMonthStart));
  const previousMonthPoint = monthlyMap.get(getMonthKey(previousMonthStart));

  const currentMonthTotal = currentMonthPoint?.total ?? 0;
  const currentMonthTransactions = currentMonthPoint?.transactions ?? 0;
  const currentMonthAverageTicket = currentMonthTransactions > 0
    ? currentMonthTotal / currentMonthTransactions
    : 0;

  const previousMonthTotal = previousMonthPoint?.total ?? 0;
  const difference = currentMonthTotal - previousMonthTotal;
  const percent = previousMonthTotal > 0 ? (difference / previousMonthTotal) * 100 : null;

  const topPlanType = planRevenueBreakdown.length > 0 ? planRevenueBreakdown[0].planType : null;

  return {
    generatedAt: new Date().toISOString(),
    seriesStart: seriesStart.toISOString(),
    seriesEnd: seriesEnd.toISOString(),
    monthlyRevenueSeries,
    planRevenueBreakdown,
    kpis: {
      currentMonthTotal,
      currentMonthTransactions,
      currentMonthAverageTicket,
      previousMonthTotal,
      monthOverMonthDifference: difference,
      monthOverMonthPercent: percent,
      topPlanType,
    },
  };
}
