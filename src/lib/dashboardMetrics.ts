import type { PrismaClient } from "../app/generated/prisma";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export interface DashboardSummary {
  generatedAt: string;
  referenceDate: string;
  stats: {
    activeStudents: {
      total: number;
    };
    expiringPlans: {
      total: number;
      thresholdDays: number;
      nextExpiring?: {
        studentId: number;
        name: string;
        lastName: string | null;
        planEndDate: string | null;
      } | null;
    };
    monthlyRevenue: {
      total: number;
      currency: string;
      transactionCount: number;
      monthStart: string;
      monthEnd: string;
      trend: {
        previousTotal: number;
        difference: number;
        percentChange: number | null;
      };
    };
    upcomingWorkshops: {
      total: number;
      horizonDays: number;
      nextWorkshop: {
        id: number;
        name: string;
        schedule: string;
        instructorName: string | null;
      } | null;
      items: Array<{
        id: number;
        name: string;
        schedule: string;
        instructorName: string | null;
      }>;
    };
    weeklyAttendance: {
      total: number;
      weekStart: string;
      trend: {
        previousTotal: number;
        difference: number;
      };
    };
  };
}

interface DashboardOptions {
  referenceDate?: Date;
  planExpiringThresholdDays?: number;
  workshopHorizonDays?: number;
  currency?: string;
}

export async function getDashboardSummary(
  prisma: PrismaClient,
  options: DashboardOptions = {}
): Promise<DashboardSummary> {
  const {
    referenceDate = new Date(),
    planExpiringThresholdDays = 7,
    workshopHorizonDays = 14,
    currency = "CLP",
  } = options;

  const now = referenceDate;
  const thresholdDate = new Date(now.getTime() + planExpiringThresholdDays * MS_PER_DAY);
  const workshopHorizonDate = new Date(now.getTime() + workshopHorizonDays * MS_PER_DAY);

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const previousMonthStart = new Date(monthStart.getFullYear(), monthStart.getMonth() - 1, 1);

  // Monday of current week (getDay: 0=Sun,1=Mon,...)
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  weekStart.setHours(0, 0, 0, 0);
  const prevWeekStart = new Date(weekStart);
  prevWeekStart.setDate(weekStart.getDate() - 7);

  const [
    activeStudentsTotal,
    expiringPlansTotal,
    nextExpiringPlan,
    revenueCurrent,
    revenuePrevious,
    transactionsThisMonth,
    upcomingWorkshops,
  ] = await Promise.all([
    prisma.student.count({
      where: {
        planStartDate: { lte: now },
        OR: [
          { planEndDate: null },
          { planEndDate: { gte: now } },
        ],
      },
    }),
    prisma.student.count({
      where: {
        planEndDate: {
          gte: now,
          lte: thresholdDate,
        },
      },
    }),
    prisma.student.findFirst({
      where: {
        planEndDate: {
          gte: now,
          lte: thresholdDate,
        },
      },
      select: {
        id: true,
        name: true,
        lastName: true,
        planEndDate: true,
      },
      orderBy: {
        planEndDate: "asc",
      },
    }),
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: {
        date: {
          gte: monthStart,
          lt: nextMonthStart,
        },
      },
    }),
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: {
        date: {
          gte: previousMonthStart,
          lt: monthStart,
        },
      },
    }),
    prisma.payment.count({
      where: {
        date: {
          gte: monthStart,
          lt: nextMonthStart,
        },
      },
    }),
    prisma.class.findMany({
      where: {
        schedule: {
          gte: now,
          lte: workshopHorizonDate,
        },
      },
      include: {
        instructor: true,
      },
      orderBy: {
        schedule: "asc",
      },
    }),
  ]);

  // Attendance counts run after the main batch to keep peak DB connections at 7 (original)
  let weeklyAttendanceTotal = 0;
  let prevWeekAttendanceTotal = 0;
  try {
    [weeklyAttendanceTotal, prevWeekAttendanceTotal] = await Promise.all([
      prisma.attendance.count({ where: { date: { gte: weekStart, lte: now } } }),
      prisma.attendance.count({ where: { date: { gte: prevWeekStart, lt: weekStart } } }),
    ]);
  } catch { /* attendance metrics are non-critical */ }

  const revenueTotal = revenueCurrent._sum.amount ?? 0;
  const revenuePrevTotal = revenuePrevious._sum.amount ?? 0;
  const revenueDifference = revenueTotal - revenuePrevTotal;
  const percentChange = revenuePrevTotal > 0 ? (revenueDifference / revenuePrevTotal) * 100 : null;

  const workshopItems = upcomingWorkshops.map((workshop) => ({
    id: workshop.id,
    name: workshop.name,
    schedule: workshop.schedule.toISOString(),
    instructorName: workshop.instructor?.name ?? null,
  }));

  return {
    generatedAt: new Date().toISOString(),
    referenceDate: now.toISOString(),
    stats: {
      activeStudents: {
        total: activeStudentsTotal,
      },
      expiringPlans: {
        total: expiringPlansTotal,
        thresholdDays: planExpiringThresholdDays,
        nextExpiring: nextExpiringPlan
          ? {
              studentId: nextExpiringPlan.id,
              name: nextExpiringPlan.name,
              lastName: nextExpiringPlan.lastName,
              planEndDate: nextExpiringPlan.planEndDate?.toISOString() ?? null,
            }
          : null,
      },
      monthlyRevenue: {
        total: revenueTotal,
        currency,
        transactionCount: transactionsThisMonth,
        monthStart: monthStart.toISOString(),
        monthEnd: nextMonthStart.toISOString(),
        trend: {
          previousTotal: revenuePrevTotal,
          difference: revenueDifference,
          percentChange,
        },
      },
      upcomingWorkshops: {
        total: workshopItems.length,
        horizonDays: workshopHorizonDays,
        nextWorkshop: workshopItems.length > 0 ? workshopItems[0] : null,
        items: workshopItems.slice(0, 5),
      },
      weeklyAttendance: {
        total: weeklyAttendanceTotal,
        weekStart: weekStart.toISOString(),
        trend: {
          previousTotal: prevWeekAttendanceTotal,
          difference: weeklyAttendanceTotal - prevWeekAttendanceTotal,
        },
      },
    },
  };
}
