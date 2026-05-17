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
    const { qrToken, classId } = body ?? {};

    if (!qrToken || !classId) {
      return NextResponse.json({ error: "qrToken y classId son requeridos." }, { status: 400 });
    }

    const classIdNum = Number(classId);
    if (!Number.isInteger(classIdNum) || classIdNum <= 0) {
      return NextResponse.json({ error: "classId inválido." }, { status: 400 });
    }

    // Find student by qrToken
    const student = await prisma.student.findUnique({
      where: { qrToken },
      select: { id: true, name: true, lastName: true },
    });

    if (!student) {
      return NextResponse.json({ error: "QR no reconocido. Alumna no encontrada." }, { status: 404 });
    }

    // Verify class exists
    const cls = await prisma.class.findUnique({
      where: { id: classIdNum },
      select: { id: true, name: true },
    });
    if (!cls) {
      return NextResponse.json({ error: "Clase no encontrada." }, { status: 404 });
    }

    // Check enrollment (optional warning, not blocking)
    const enrolled = await prisma.enrollment.findFirst({
      where: { studentId: student.id, classId: classIdNum },
    });

    // Check duplicate attendance today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const existing = await prisma.attendance.findFirst({
      where: {
        studentId: student.id,
        classId: classIdNum,
        date: { gte: todayStart, lte: todayEnd },
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          error: "La alumna ya tiene asistencia registrada hoy.",
          alreadyRecorded: true,
          student: { id: student.id, name: student.name, lastName: student.lastName },
        },
        { status: 409 }
      );
    }

    // Record attendance
    const attendance = await prisma.attendance.create({
      data: { studentId: student.id, classId: classIdNum },
    });

    return NextResponse.json({
      ok: true,
      attendance: { id: attendance.id, date: attendance.date },
      student: { id: student.id, name: student.name, lastName: student.lastName },
      className: cls.name,
      notEnrolled: !enrolled,
    });
  } catch (err) {
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
