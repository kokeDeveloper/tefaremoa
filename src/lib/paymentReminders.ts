import type { PrismaClient } from "../app/generated/prisma";

export interface PaymentReminderStudent {
  id: number;
  name: string;
  lastName: string | null;
  email: string;
  phone?: string | null;
  planType: string;
  planStatus: string;
  planStartDate: Date | string | null;
  planEndDate: Date | string | null;
  daysUntilDue?: number;
  daysOverdue?: number;
}

export interface PaymentReminderResult {
  generatedAt: string;
  monthStart: string;
  nextMonthStart: string;
  dueDate: string;
  totals: {
    pending: number;
    overdue: number;
  };
  students: {
    pending: PaymentReminderStudent[];
    overdue: PaymentReminderStudent[];
  };
}

interface Options {
  referenceDate?: Date;
  dueDay?: number;
}

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function getMonthStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getNextMonthStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1);
}

function getDueDate(monthStart: Date, dueDay: number) {
  const result = new Date(monthStart);
  const month = result.getMonth();
  result.setDate(dueDay);
  if (result.getMonth() !== month) {
    // Clamp to last day of month if dueDay exceeds month length
    result.setMonth(month + 1, 0);
  }
  result.setHours(23, 59, 59, 999);
  return result;
}

function daysBetween(later: Date, earlier: Date) {
  return Math.ceil((later.getTime() - earlier.getTime()) / MS_PER_DAY);
}

export async function getPaymentReminderData(
  prisma: PrismaClient,
  options: Options = {}
): Promise<PaymentReminderResult> {
  const { referenceDate = new Date(), dueDay = 5 } = options;
  const monthStart = getMonthStart(referenceDate);
  const nextMonthStart = getNextMonthStart(referenceDate);
  const dueDate = getDueDate(monthStart, dueDay);

  const activeStudents = await prisma.student.findMany({
    where: {
      planStartDate: { lte: nextMonthStart },
      planEndDate: { gte: monthStart },
    },
    select: {
      id: true,
      name: true,
      lastName: true,
      email: true,
      phone: true,
      planType: true,
      planStatus: true,
      planStartDate: true,
      planEndDate: true,
      payments: {
        where: {
          date: {
            gte: monthStart,
            lt: nextMonthStart,
          },
        },
        select: {
          date: true,
          amount: true,
        },
      },
    },
  });

  const pending: PaymentReminderStudent[] = [];
  const overdue: PaymentReminderStudent[] = [];

  activeStudents.forEach((student) => {
    if (student.payments.length > 0) {
      return;
    }

    const baseInfo: PaymentReminderStudent = {
      id: student.id,
      name: student.name,
      lastName: student.lastName,
      email: student.email,
      phone: student.phone,
      planType: student.planType,
      planStatus: student.planStatus,
      planStartDate: student.planStartDate,
      planEndDate: student.planEndDate,
    };

    if (referenceDate <= dueDate) {
      const daysUntilDue = Math.max(
        0,
        Math.floor((dueDate.getTime() - referenceDate.getTime()) / MS_PER_DAY)
      );
      pending.push({ ...baseInfo, daysUntilDue });
    } else {
      const daysOverdue = Math.max(
        1,
        daysBetween(referenceDate, dueDate)
      );
      overdue.push({ ...baseInfo, daysOverdue });
    }
  });

  const sortByName = (a: PaymentReminderStudent, b: PaymentReminderStudent) =>
    `${a.name} ${a.lastName ?? ""}`.localeCompare(`${b.name} ${b.lastName ?? ""}`);

  pending.sort(sortByName);
  overdue.sort(sortByName);

  return {
    generatedAt: referenceDate.toISOString(),
    monthStart: monthStart.toISOString(),
    nextMonthStart: nextMonthStart.toISOString(),
    dueDate: dueDate.toISOString(),
    totals: {
      pending: pending.length,
      overdue: overdue.length,
    },
    students: {
      pending,
      overdue,
    },
  };
}
