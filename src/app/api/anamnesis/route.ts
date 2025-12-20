import { NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';

const prisma = new PrismaClient();

// Simple in-memory rate limit per IP: max 5 requests per minute
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;
const hits = new Map<string, number[]>();

function getClientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0]?.trim() || 'unknown';
  return req.headers.get('x-real-ip') || 'unknown';
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;
  const timestamps = hits.get(ip)?.filter((t) => t > windowStart) ?? [];
  if (timestamps.length >= MAX_REQUESTS) {
    hits.set(ip, timestamps);
    return true;
  }
  timestamps.push(now);
  hits.set(ip, timestamps);
  return false;
}

function toStringOrNull(val: unknown): string | null {
  if (typeof val !== 'string') return null;
  const trimmed = val.trim();
  return trimmed.length ? trimmed : null;
}

function toNumberOrNull(val: unknown): number | null {
  if (val === null || val === undefined || val === '') return null;
  const num = Number(val);
  return Number.isFinite(num) ? num : null;
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Demasiados envíos, intenta en un minuto.' }, { status: 429 });
  }

  try {
    const body = await req.json();

    // Honeypot: si viene relleno, descartar
    if (toStringOrNull(body.website) || toStringOrNull(body.hp)) {
      return NextResponse.json({ error: 'Solicitud no válida.' }, { status: 400 });
    }

    const name = toStringOrNull(body.name);
    const contact = toStringOrNull(body.contact);
    const age = toNumberOrNull(body.age);
    const weightKg = toNumberOrNull(body.weightKg);
    const heightM = toNumberOrNull(body.heightM);
    const activityDaysPerWeek = toNumberOrNull(body.activityDaysPerWeek);
    const sessionDurationMinutes = toNumberOrNull(body.sessionDurationMinutes);
    const consentAccepted = Boolean(body.consentAccepted);

    if (!name || !contact) {
      return NextResponse.json({ error: 'Nombre y contacto son obligatorios.' }, { status: 400 });
    }
    if (!consentAccepted) {
      return NextResponse.json({ error: 'Debes aceptar el consentimiento.' }, { status: 400 });
    }

    const emailFromContact = contact.includes('@') ? contact.toLowerCase() : null;
    let studentId: number | null = null;

    if (emailFromContact) {
      const student = await prisma.student.findUnique({ where: { email: emailFromContact } });
      if (student) {
        studentId = student.id;
      }
    }

    const record = await prisma.anamnesis.create({
      data: {
        studentId: studentId ?? undefined,
        name,
        age,
        contact,
        weightKg,
        heightM,
        injuries: toStringOrNull(body.injuries),
        chronicDiseases: toStringOrNull(body.chronicDiseases),
        allergies: toStringOrNull(body.allergies),
        medications: toStringOrNull(body.medications),
        surgeries: toStringOrNull(body.surgeries),
        activityDaysPerWeek,
        activityType: toStringOrNull(body.activityType),
        sessionDurationMinutes,
        consentAccepted,
      },
    });

    return NextResponse.json({ ok: true, id: record.id });
  } catch (error) {
    console.error('anamnesis post error', error);
    return NextResponse.json({ error: 'Error al guardar la anamnesis.' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
