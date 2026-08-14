import { NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";
import { verifyToken } from "@/lib/jwt";
import { REQUIRED_DOCUMENT_KEYS, ACADEMY_DOCUMENTS } from "@/lib/documentTexts";

const prisma = new PrismaClient();

function isAdmin(req: Request): boolean {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/token=([^;]+)/);
  const token = match ? match[1] : null;
  const payload = token ? verifyToken(token) : null;
  return !!payload && payload.role === "admin";
}

// Returns all students with their consent status for each required document
export async function GET(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const students = await prisma.student.findMany({
      select: {
        id: true,
        name: true,
        lastName: true,
        email: true,
        consents: {
          select: { documentKey: true, documentVersion: true, acceptedAt: true },
        },
      },
      orderBy: { name: "asc" },
    });

    const documents = ACADEMY_DOCUMENTS.map((d) => ({ key: d.key, title: d.title, version: d.version }));

    const rows = students.map((s) => {
      const consentMap = Object.fromEntries(s.consents.map((c) => [c.documentKey, c]));
      const status = REQUIRED_DOCUMENT_KEYS.reduce(
        (acc, key) => {
          acc[key] = consentMap[key]
            ? { accepted: true, acceptedAt: consentMap[key].acceptedAt, version: consentMap[key].documentVersion }
            : { accepted: false };
          return acc;
        },
        {} as Record<string, { accepted: boolean; acceptedAt?: Date; version?: string }>
      );
      const allAccepted = REQUIRED_DOCUMENT_KEYS.every((k) => status[k].accepted);
      return { id: s.id, name: s.name, lastName: s.lastName, email: s.email, status, allAccepted };
    });

    return NextResponse.json({ documents, students: rows });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
