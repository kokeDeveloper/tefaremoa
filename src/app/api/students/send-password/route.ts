import { NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";
import { verifyToken } from "@/lib/jwt";
import { sendMail, MailerError } from "@/lib/mailer";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const prisma = new PrismaClient();

const STUDENT_PORTAL_URL = process.env.NEXT_PUBLIC_STUDENT_PORTAL_URL || "https://tefaremoa.com";
// Usa el logo servido desde /public; permite override por env si se requiere.
const LOGO_URL = process.env.NEXT_PUBLIC_LOGO_URL || "/tefaremoa.svg";

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

    const subject = "Tu acceso temporal a Te Fare Mo'a";
    const text = `Hola ${student.name || ""},\n\nTe damos la bienvenida a Te Fare Mo'a. Generamos una contraseña temporal para que puedas ingresar al portal de alumnas (${STUDENT_PORTAL_URL}):\n\n${tempPassword}\n\nIngresa y cambia tu contraseña apenas puedas. Si no solicitaste este acceso, avísanos para ayudarte.\n\nMauruuru,\nEquipo Te Fare Mo'a.`;
    const html = `
      <div style="font-family:Arial,sans-serif; color:#111;">
        <div style="text-align:center; margin-bottom:16px;">
          <img src="${LOGO_URL}" alt="Te Fare Mo'a" style="max-width:220px; height:auto;" />
        </div>
        <p>Hola ${student.name || ""},</p>
        <p>Te damos la bienvenida a Te Fare Mo'a. Generamos una contraseña temporal para que puedas ingresar al portal de alumnas:</p>
        <p style="font-size:18px; font-weight:bold; color:#d35400;">${tempPassword}</p>
        <p>
          Accede aquí: <a href="${STUDENT_PORTAL_URL}" style="color:#d35400; font-weight:600;">${STUDENT_PORTAL_URL}</a>
        </p>
        <p>Ingresa y cambia tu contraseña apenas puedas. Si no solicitaste este acceso, avísanos para ayudarte.</p>
        <p style="margin-top:24px;">Mauruuru,<br/>Equipo Te Fare Mo'a.</p>
      </div>
    `;

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
