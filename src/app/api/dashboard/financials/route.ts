import { NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma";
import { verifyToken } from "../../../../lib/auth";
import { getFinancialMetrics } from "../../../../lib/financialMetrics";

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
    const monthsParam = parseNumber(url.searchParams.get("months"));

    let referenceDate: Date | undefined;
    if (referenceDateParam) {
      const parsedReference = new Date(referenceDateParam);
      if (Number.isNaN(parsedReference.getTime())) {
        return NextResponse.json({ error: "Invalid date" }, { status: 400 });
      }
      referenceDate = parsedReference;
    }

    const metrics = await getFinancialMetrics(prisma, {
      referenceDate,
      months: monthsParam,
    });

    return NextResponse.json(metrics);
  } catch (error) {
    console.error("dashboard financials error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
