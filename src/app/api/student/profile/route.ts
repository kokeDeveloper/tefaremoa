import { NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";
import { verifyToken } from "@/lib/jwt";

const prisma = new PrismaClient();

function getStudentPayload(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/token=([^;]+)/);
  const token = match ? match[1] : null;
  const payload = token ? verifyToken(token) : null;
  if (!payload || payload.role !== "student" || typeof payload.id !== "number") {
    return null;
  }
  return payload as { id: number; role: "student"; email?: string; name?: string };
}

function toTrimmedStringOrNull(val: unknown): string | null {
  if (val === null || val === undefined) return null;
  if (typeof val !== "string") return null;
  const trimmed = val.trim();
  return trimmed.length ? trimmed : null;
}

function toDateOrNull(val: unknown): Date | null {
  if (val === null || val === undefined) return null;
  if (typeof val !== "string") return null;
  const trimmed = val.trim();
  if (!trimmed) return null;
  const date = new Date(trimmed);
  return Number.isNaN(date.getTime()) ? null : date;
}

export async function GET(req: Request) {
  try {
    const payload = getStudentPayload(req);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const student = await prisma.student.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        name: true,
        lastName: true,
        email: true,
        phone: true,
        nickname: true,
        address: true,
        city: true,
        birthDate: true,
      },
    });

    if (!student) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(student);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(req: Request) {
  try {
    const payload = getStudentPayload(req);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }

    const name = toTrimmedStringOrNull((body as any).name);
    const lastName = toTrimmedStringOrNull((body as any).lastName);

    if (name !== null && name.length === 0) {
      return NextResponse.json({ error: "Nombre inválido" }, { status: 400 });
    }
    if (lastName !== null && lastName.length === 0) {
      return NextResponse.json({ error: "Apellido inválido" }, { status: 400 });
    }

    const data = {
      ...(name !== null ? { name } : {}),
      ...(lastName !== null ? { lastName } : {}),
      phone: (body as any).phone === "" ? null : toTrimmedStringOrNull((body as any).phone),
      nickname: (body as any).nickname === "" ? null : toTrimmedStringOrNull((body as any).nickname),
      address: (body as any).address === "" ? null : toTrimmedStringOrNull((body as any).address),
      city: (body as any).city === "" ? null : toTrimmedStringOrNull((body as any).city),
      birthDate: (body as any).birthDate === "" ? null : toDateOrNull((body as any).birthDate),
    };

    await prisma.student.update({ where: { id: payload.id }, data });

    const updated = await prisma.student.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        name: true,
        lastName: true,
        email: true,
        phone: true,
        nickname: true,
        address: true,
        city: true,
        birthDate: true,
      },
    });

    return NextResponse.json({ ok: true, student: updated });
  } catch {
    return NextResponse.json({ error: "No se pudo actualizar el perfil." }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
