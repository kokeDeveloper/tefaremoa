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

export async function POST(req: Request) {
  try {
    if (!getAdminPayload(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const { studentId, classId } = body ?? {};

    if (!studentId || !classId) {
      return NextResponse.json({ error: "studentId y classId son requeridos." }, { status: 400 });
    }

    const studentIdNum = Number(studentId);
    const classIdNum = Number(classId);
    if (!Number.isInteger(studentIdNum) || studentIdNum <= 0 ||
        !Number.isInteger(classIdNum) || classIdNum <= 0) {
      return NextResponse.json({ error: "IDs inválidos." }, { status: 400 });
    }

    const student = await prisma.student.findUnique({
      where: { id: studentIdNum },
      select: { id: true, name: true, lastName: true },
    });
    if (!student) {
      return NextResponse.json({ error: "Alumna no encontrada." }, { status: 404 });
    }

    const cls = await prisma.class.findUnique({
      where: { id: classIdNum },
      select: { id: true, name: true },
    });
    if (!cls) {
      return NextResponse.json({ error: "Clase no encontrada." }, { status: 404 });
    }

    // Check duplicate today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const existing = await prisma.attendance.findFirst({
      where: {
        studentId: studentIdNum,
        classId: classIdNum,
        date: { gte: todayStart, lte: todayEnd },
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          alreadyRecorded: true,
          attendanceId: existing.id,
          student: { id: student.id, name: student.name, lastName: student.lastName },
        },
        { status: 409 }
      );
    }

    const attendance = await prisma.attendance.create({
      data: { studentId: studentIdNum, classId: classIdNum },
    });

    return NextResponse.json({
      ok: true,
      attendanceId: attendance.id,
      student: { id: student.id, name: student.name, lastName: student.lastName },
    });
  } catch (err) {
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
