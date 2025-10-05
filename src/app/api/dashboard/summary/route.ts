import { NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma";
import { verifyToken } from "../../../../lib/auth";
import { getDashboardSummary } from "../../../../lib/dashboardMetrics";

const prisma = new PrismaClient();

function parseNumber(value: string | null): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

export async function GET(req: Request) {
  try {
    const cookie = req.headers.get("cookie") || "";
    const match = cookie.match(/token=([^;]+)/);
    const token = match ? match[1] : null;

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const referenceDateParam = url.searchParams.get("date");
    const thresholdParam = parseNumber(url.searchParams.get("planThresholdDays"));
    const horizonParam = parseNumber(url.searchParams.get("workshopHorizonDays"));

    let referenceDate: Date | undefined;
    if (referenceDateParam) {
      const parsedReference = new Date(referenceDateParam);
      if (Number.isNaN(parsedReference.getTime())) {
        return NextResponse.json({ error: "Invalid date" }, { status: 400 });
      }
      referenceDate = parsedReference;
    }

    const summary = await getDashboardSummary(prisma, {
      referenceDate,
      planExpiringThresholdDays: thresholdParam,
      workshopHorizonDays: horizonParam,
    });

    return NextResponse.json(summary);
  } catch (error) {
    console.error("dashboard summary error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
