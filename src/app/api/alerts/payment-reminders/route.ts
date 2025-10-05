import { NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma";
import { verifyToken } from "../../../../lib/auth";
import { getPaymentReminderData } from "../../../../lib/paymentReminders";

const prisma = new PrismaClient();

function parseDueDay(value: string | null): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return undefined;
  return Math.min(Math.max(Math.floor(parsed), 1), 31);
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
    const dateParam = url.searchParams.get("date");
    const dueDayParam = parseDueDay(url.searchParams.get("dueDay"));

    let referenceDate: Date | undefined;
    if (dateParam) {
      const parsedDate = new Date(dateParam);
      if (Number.isNaN(parsedDate.getTime())) {
        return NextResponse.json({ error: "Invalid date" }, { status: 400 });
      }
      referenceDate = parsedDate;
    }

    const data = await getPaymentReminderData(prisma, {
      referenceDate,
      dueDay: dueDayParam,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("payment-reminders alert error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
