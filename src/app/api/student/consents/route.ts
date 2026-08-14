import { NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";
import { verifyToken } from "@/lib/jwt";
import { ACADEMY_DOCUMENTS, REQUIRED_DOCUMENT_KEYS } from "@/lib/documentTexts";

const prisma = new PrismaClient();

function getStudentId(req: Request): number | null {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/token=([^;]+)/);
  const token = match ? match[1] : null;
  const payload = token ? verifyToken(token) : null;
  if (!payload || payload.role !== "student" || typeof payload.id !== "number") return null;
  return payload.id;
}

// Returns which required documents the student has already accepted
export async function GET(req: Request) {
  const studentId = getStudentId(req);
  if (!studentId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const consents = await prisma.documentConsent.findMany({
      where: { studentId },
      select: { documentKey: true, documentVersion: true, acceptedAt: true },
    });

    const accepted = consents.map((c) => c.documentKey);
    const pending = REQUIRED_DOCUMENT_KEYS.filter((k) => !accepted.includes(k));

    return NextResponse.json({ consents, pending, allAccepted: pending.length === 0 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// Records acceptance of one or more documents
export async function POST(req: Request) {
  const studentId = getStudentId(req);
  if (!studentId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json().catch(() => ({}));
    const keys: string[] = Array.isArray(body.documentKeys) ? body.documentKeys : [];

    const validKeys = keys.filter((k) => REQUIRED_DOCUMENT_KEYS.includes(k as any));
    if (validKeys.length === 0) {
      return NextResponse.json({ error: "No valid document keys provided" }, { status: 400 });
    }

    // Upsert each consent (idempotent)
    await Promise.all(
      validKeys.map((key) => {
        const doc = ACADEMY_DOCUMENTS.find((d) => d.key === key)!;
        return prisma.documentConsent.upsert({
          where: { studentId_documentKey: { studentId, documentKey: key } },
          update: { documentVersion: doc.version, acceptedAt: new Date() },
          create: { studentId, documentKey: key, documentVersion: doc.version },
        });
      })
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
