import { NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";
import { verifyToken } from "@/lib/jwt";
import { sendMail, MailerError } from "@/lib/mailer";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const prisma = new PrismaClient();

function generateTempPassword() {
  return crypto.randomBytes(9).toString("base64url").slice(0, 12);
}

export async function POST(req: Request) {
  try {
    const cookie = req.headers.get("cookie") || "";
    const match = cookie.match(/token=([^;]+)/);
    const token = match ? match[1] : null;
    const payload = token ? verifyToken(token) : null;
    if (!payload || payload.role === "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const studentId = Number(body?.studentId);
    if (!studentId || Number.isNaN(studentId)) {
      return NextResponse.json({ error: "Falta studentId válido" }, { status: 400 });
    }

    const student = await prisma.student.findUnique({ where: { id: studentId } });
    if (!student || !student.email) {
      return NextResponse.json({ error: "Alumna no encontrada" }, { status: 404 });
    }

    const tempPassword = generateTempPassword();
    const hashed = await bcrypt.hash(tempPassword, 10);
    await prisma.student.update({ where: { id: studentId }, data: { password: hashed } });

    const subject = "Tu contraseña temporal para Ori Tahiti";
    const text = `Hola ${student.name || ""},\n\nGeneramos una contraseña temporal para que puedas ingresar:\n\n${tempPassword}\n\nTe recomendamos cambiarla después de iniciar sesión.`;
    const html = `<p>Hola ${student.name || ""},</p><p>Generamos una contraseña temporal para que puedas ingresar:</p><p><strong>${tempPassword}</strong></p><p>Te recomendamos cambiarla después de iniciar sesión.</p>`;

    await sendMail({ to: student.email, subject, text, html });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    if (err instanceof MailerError) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: "No se pudo enviar la contraseña." }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
