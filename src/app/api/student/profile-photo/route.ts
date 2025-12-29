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
  return payload as { id: number; role: "student" };
}

const MAX_BYTES = 2_000_000; // 2MB
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function GET(req: Request) {
  try {
    const payload = getStudentPayload(req);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const student = await prisma.student.findUnique({
      where: { id: payload.id },
      select: { profilePhoto: true, profilePhotoMime: true },
    });

    if (!student || !student.profilePhoto || !student.profilePhotoMime) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const headers = new Headers();
    headers.set("Content-Type", student.profilePhotoMime);
    headers.set("Cache-Control", "no-store");

    return new NextResponse(student.profilePhoto as any, { status: 200, headers });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(req: Request) {
  try {
    const payload = getStudentPayload(req);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const form = await req.formData().catch(() => null);
    if (!form) {
      return NextResponse.json({ error: "Invalid form" }, { status: 400 });
    }

    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Archivo requerido." }, { status: 400 });
    }

    if (!ALLOWED_MIME.has(file.type)) {
      return NextResponse.json({ error: "Formato no permitido. Usa JPG/PNG/WEBP." }, { status: 400 });
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "La imagen supera el máximo (2MB)." }, { status: 400 });
    }

    const ab = await file.arrayBuffer();
    const bytes = Buffer.from(ab);

    await prisma.student.update({
      where: { id: payload.id },
      data: { profilePhoto: bytes, profilePhotoMime: file.type },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "No se pudo guardar la foto." }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
