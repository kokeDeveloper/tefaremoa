import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@/app/generated/prisma';
import { signToken } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body || {};

    if (!email || !password) {
      return NextResponse.json({ error: 'Email y contraseña son requeridos.' }, { status: 400 });
    }

    const student = await prisma.student.findUnique({ where: { email } });
    if (!student) {
      return NextResponse.json({ error: 'Credenciales inválidas.' }, { status: 401 });
    }

    let valid = false;
    // Algunos registros antiguos pueden tener password en texto plano
    if (student.password) {
      // Intenta bcrypt; si falla, compara plano
      valid = await bcrypt.compare(password, student.password).catch(() => false);
      if (!valid) {
        valid = student.password === password;
      }
    }

    if (!valid) {
      return NextResponse.json({ error: 'Credenciales inválidas.' }, { status: 401 });
    }

    const token = signToken({ id: student.id, email: student.email, role: 'student', name: student.name });
    const res = NextResponse.json({ ok: true });
    res.cookies.set('token', token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7 });
    return res;
  } catch (err) {
    return NextResponse.json({ error: 'Error en login.' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
