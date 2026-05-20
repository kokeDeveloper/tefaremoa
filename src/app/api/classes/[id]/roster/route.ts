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

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!getAdminPayload(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const classIdNum = Number(id);
    if (!Number.isInteger(classIdNum) || classIdNum <= 0) {
      return NextResponse.json({ error: "id inválido." }, { status: 400 });
    }

    // Optional date filter (defaults to today)
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get("date"); // YYYY-MM-DD
    const baseDate = dateParam ? new Date(dateParam) : new Date();
    const dayStart = new Date(baseDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(baseDate);
    dayEnd.setHours(23, 59, 59, 999);

    // Get all enrolled students
    const enrollments = await prisma.enrollment.findMany({
      where: { classId: classIdNum },
      include: {
        student: {
          select: { id: true, name: true, lastName: true, email: true },
        },
      },
      orderBy: [
        { student: { lastName: "asc" } },
        { student: { name: "asc" } },
      ],
    });

    // Get today's attendance for this class
    const attendances = await prisma.attendance.findMany({
      where: {
        classId: classIdNum,
        date: { gte: dayStart, lte: dayEnd },
      },
      select: { id: true, studentId: true, date: true },
    });

    const attendanceMap = new Map(attendances.map((a) => [a.studentId, a]));

    const roster = enrollments.map((e) => {
      const att = attendanceMap.get(e.student.id);
      return {
        studentId: e.student.id,
        name: e.student.name,
        lastName: e.student.lastName,
        email: e.student.email,
        present: !!att,
        attendanceId: att?.id ?? null,
        attendanceDate: att?.date ?? null,
      };
    });

    return NextResponse.json(roster);
  } catch (err) {
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
