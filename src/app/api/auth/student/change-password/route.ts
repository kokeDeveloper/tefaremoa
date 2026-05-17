import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@/app/generated/prisma";
import { verifyToken, signToken } from "@/lib/jwt";

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
    const updated = await prisma.student.update({
      where: { id: payload.id },
      data: { password: hashed, mustChangePassword: false },
      select: { id: true, email: true, name: true },
    });

    // Issue a new token with mustChangePassword = false so middleware lets through
    const newToken = signToken({ id: updated.id, email: updated.email, role: "student", name: updated.name, mustChangePassword: false });
    const res = NextResponse.json({ ok: true });
    res.cookies.set("token", newToken, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (err) {
    return NextResponse.json({ error: "No se pudo actualizar la contraseña." }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
