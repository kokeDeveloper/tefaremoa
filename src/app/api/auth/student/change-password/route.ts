import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@/app/generated/prisma";
import { verifyToken } from "@/lib/jwt";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const cookie = req.headers.get("cookie") || "";
    const match = cookie.match(/token=([^;]+)/);
    const token = match ? match[1] : null;
    const payload = token ? verifyToken(token) : null;
    if (!payload || payload.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const newPassword = body?.newPassword as string | undefined;
    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json({ error: "La nueva contraseña debe tener al menos 8 caracteres." }, { status: 400 });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.student.update({ where: { id: payload.id }, data: { password: hashed } });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "No se pudo actualizar la contraseña." }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
