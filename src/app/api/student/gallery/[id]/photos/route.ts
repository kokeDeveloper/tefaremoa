import { NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";
import { verifyToken } from "@/lib/jwt";
import fs from "fs";
import path from "path";
import { getPhotoPath } from "@/lib/galleryStorage";

function getStudentPayload(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/token=([^;]+)/);
  const token = match ? match[1] : null;
  const payload = token ? verifyToken(token) : null;
  if (!payload || (payload as any).role !== "student") return null;
  return payload as { id: number; role: "student" };
}

// GET /api/student/gallery/[id]/photos  → list photos in event (must be published)
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!getStudentPayload(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const prisma = new PrismaClient();
  try {
    const { id } = await params;
    const event = await prisma.galleryEvent.findUnique({
      where: { id: Number(id), isPublished: true },
    });
    if (!event) return NextResponse.json({ error: "Evento no encontrado." }, { status: 404 });

    const photos = await prisma.galleryPhoto.findMany({
      where: { eventId: Number(id) },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      select: { id: true, title: true, sizeBytes: true, order: true, createdAt: true },
    });
    return NextResponse.json({ event, photos });
  } finally {
    await prisma.$disconnect();
  }
}
