import { NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";
import { verifyToken } from "@/lib/jwt";

const prisma = new PrismaClient();

function getAdminPayload(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/token=([^;]+)/);
  const token = match ? match[1] : null;
  const payload = token ? verifyToken(token) : null;
  if (!payload || payload.role === "student") return null;
  return payload;
}

export async function GET(req: Request) {
  try {
    if (!getAdminPayload(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const classIdParam = searchParams.get("classId");
    if (!classIdParam) {
      return NextResponse.json({ error: "classId es requerido." }, { status: 400 });
    }

    const classIdNum = Number(classIdParam);
    if (!Number.isInteger(classIdNum) || classIdNum <= 0) {
      return NextResponse.json({ error: "classId inválido." }, { status: 400 });
    }

    // Default range: last 30 days
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 30);
    fromDate.setHours(0, 0, 0, 0);
    const toDate = new Date();
    toDate.setHours(23, 59, 59, 999);

    const fromParam = searchParams.get("from");
    const toParam = searchParams.get("to");

    if (fromParam) {
      const parsed = new Date(fromParam);
      if (!isNaN(parsed.getTime())) { fromDate.setTime(parsed.getTime()); fromDate.setHours(0, 0, 0, 0); }
    }
    if (toParam) {
      const parsed = new Date(toParam);
      if (!isNaN(parsed.getTime())) { toDate.setTime(parsed.getTime()); toDate.setHours(23, 59, 59, 999); }
    }

    // All enrolled students ordered by name
    const enrollments = await prisma.enrollment.findMany({
      where: { classId: classIdNum },
      include: { student: { select: { id: true, name: true, lastName: true } } },
      orderBy: [{ student: { lastName: "asc" } }, { student: { name: "asc" } }],
    });

    // All attendance records in range for this class
    const records = await prisma.attendance.findMany({
      where: { classId: classIdNum, date: { gte: fromDate, lte: toDate } },
      select: { studentId: true, date: true },
      orderBy: { date: "asc" },
    });

    // Unique session dates (YYYY-MM-DD), sorted
    const dateSet = new Set<string>();
    for (const r of records) {
      dateSet.add(new Date(r.date).toISOString().slice(0, 10));
    }
    const dates = Array.from(dateSet).sort();

    // Per-student present dates
    const studentAttMap = new Map<number, Set<string>>();
    for (const r of records) {
      const d = new Date(r.date).toISOString().slice(0, 10);
      if (!studentAttMap.has(r.studentId)) studentAttMap.set(r.studentId, new Set());
      studentAttMap.get(r.studentId)!.add(d);
    }

    const students = enrollments.map((e) => ({
      id: e.student.id,
      name: e.student.name,
      lastName: e.student.lastName,
      presentDates: Array.from(studentAttMap.get(e.student.id) ?? []),
    }));

    return NextResponse.json({ dates, students });
  } catch {
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
