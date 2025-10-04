import { NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma";
import { verifyToken } from "../../../../lib/auth";
import {
  calculatePlanAlert,
  mapAlertToPlanStatus,
  PlanStatusLabel,
} from "../../../../lib/planAlerts";

const prisma = new PrismaClient();
const MS_PER_DAY = 1000 * 60 * 60 * 24;

interface StatusCounters {
  Active: number;
  ExpiringSoon: number;
  Expired: number;
  NoPlan: number;
}

function defaultCounters(): StatusCounters {
  return {
    Active: 0,
    ExpiringSoon: 0,
    Expired: 0,
    NoPlan: 0,
  };
}

export async function POST(req: Request) {
  try {
    const cookie = req.headers.get("cookie") || "";
    const tokenMatch = cookie.match(/token=([^;]+)/);
    const token = tokenMatch ? tokenMatch[1] : null;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const thresholdParam = url.searchParams.get("days");
    const expiringSoonThresholdDays = thresholdParam ? Math.max(Number(thresholdParam), 0) : 7;

    const students = await prisma.student.findMany({
      select: {
        id: true,
        planEndDate: true,
        planStatus: true,
      },
    });

    const updates: { id: number; planStatus: PlanStatusLabel }[] = [];
    const counters = defaultCounters();

    for (const student of students) {
      const alert = calculatePlanAlert(student.planEndDate, { expiringSoonThresholdDays });
      const status = mapAlertToPlanStatus(alert);
      counters[status] += 1;

      if (student.planStatus !== status) {
        updates.push({ id: student.id, planStatus: status });
      }
    }

    if (updates.length > 0) {
      const batchSize = 50;
      for (let i = 0; i < updates.length; i += batchSize) {
        const chunk = updates.slice(i, i + batchSize);
        await prisma.$transaction(
          chunk.map((item) =>
            prisma.student.update({
              where: { id: item.id },
              data: { planStatus: item.planStatus },
            })
          )
        );
      }
    }

    return NextResponse.json({
      total: students.length,
      updated: updates.length,
      thresholdDays: expiringSoonThresholdDays,
      breakdown: counters,
    });
  } catch (error) {
    console.error("sync-plan-status error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const method = url.searchParams.get("method") || "POST";
  if (method.toUpperCase() === "POST") {
    return POST(req);
  }
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
