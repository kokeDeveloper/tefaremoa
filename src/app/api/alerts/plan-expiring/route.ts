import { NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma";
import { verifyToken } from "../../../../lib/auth";
import { calculatePlanAlert, shouldIncludeInAlerts } from "../../../../lib/planAlerts";

const prisma = new PrismaClient();
const MS_PER_DAY = 1000 * 60 * 60 * 24;

export async function GET(req: Request) {
  try {
    const cookie = req.headers.get("cookie") || "";
    const match = cookie.match(/token=([^;]+)/);
    const token = match ? match[1] : null;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const thresholdParam = url.searchParams.get("days");
    const includeNoPlan = url.searchParams.get("includeNoPlan") === "true";
    const expiringSoonThresholdDays = thresholdParam ? Math.max(Number(thresholdParam), 0) : 7;

    const now = new Date();
    const soonDate = new Date(now.getTime() + expiringSoonThresholdDays * MS_PER_DAY);

    const candidates = await prisma.student.findMany({
      select: {
        id: true,
        name: true,
        lastName: true,
        email: true,
        planType: true,
        planStatus: true,
        planStartDate: true,
        planEndDate: true,
      },
      where: {
        OR: [
          { planEndDate: { lte: soonDate } },
          includeNoPlan ? { planEndDate: null } : undefined,
        ].filter(Boolean) as any,
      },
      orderBy: { planEndDate: "asc" },
    });

    const expired: any[] = [];
    const expiringSoon: any[] = [];
    const noPlan: any[] = [];

    for (const student of candidates) {
      const alert = calculatePlanAlert(student.planEndDate, { expiringSoonThresholdDays });
      const payload = {
        ...student,
        alert,
      };

      if (alert.status === "EXPIRED") {
        expired.push(payload);
      } else if (alert.status === "EXPIRING_SOON") {
        expiringSoon.push(payload);
      } else if (includeNoPlan && alert.status === "NO_PLAN") {
        noPlan.push(payload);
      }
    }

    const totals = {
      expired: expired.length,
      expiringSoon: expiringSoon.length,
      noPlan: includeNoPlan ? noPlan.length : undefined,
    };

    return NextResponse.json({
      generatedAt: now.toISOString(),
      thresholdDays: expiringSoonThresholdDays,
      totals,
      students: {
        expired,
        expiringSoon,
        ...(includeNoPlan ? { noPlan } : {}),
      },
    });
  } catch (error) {
    console.error("plan-expiring alert error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
