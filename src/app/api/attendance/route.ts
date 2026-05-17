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
    const studentIdParam = searchParams.get("studentId");
    const date = searchParams.get("date"); // YYYY-MM-DD, filters to that day

    const where: Record<string, unknown> = {};
    if (classIdParam) where.classId = Number(classIdParam);
    if (studentIdParam) where.studentId = Number(studentIdParam);
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      where.date = { gte: start, lte: end };
    }

    const records = await prisma.attendance.findMany({
      where,
      include: {
        student: { select: { id: true, name: true, lastName: true } },
        class: { select: { id: true, name: true } },
      },
      orderBy: { date: "desc" },
      take: 200,
    });

    return NextResponse.json(records);
  } catch (err) {
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(req: Request) {
  try {
    if (!getAdminPayload(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    if (!id) return NextResponse.json({ error: "id requerido." }, { status: 400 });

    await prisma.attendance.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
