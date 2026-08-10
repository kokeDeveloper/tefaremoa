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

// GET /api/student/gallery/[id]/photos/[photoId]/file  → download photo
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string; photoId: string }> }
) {
  if (!getStudentPayload(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const prisma = new PrismaClient();
  try {
    const { id, photoId } = await params;
    const photo = await prisma.galleryPhoto.findFirst({
      where: { id: Number(photoId), eventId: Number(id), event: { isPublished: true } },
    });
    if (!photo) return NextResponse.json({ error: "Foto no encontrada." }, { status: 404 });

    const filepath = getPhotoPath(Number(id), photo.filename);
    if (!fs.existsSync(filepath)) return NextResponse.json({ error: "Archivo no disponible." }, { status: 404 });

    const buffer = fs.readFileSync(filepath);
    const ext = path.extname(photo.filename).toLowerCase().slice(1) || "jpg";
    const mime = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
    const download = new URL(req.url).searchParams.get("dl") === "1";
    const disposition = download
      ? `attachment; filename="${photo.title || photo.filename}"`
      : "inline";

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": mime,
        "Cache-Control": "private, max-age=300",
        "Content-Disposition": disposition,
        "Content-Length": String(buffer.length),
      },
    });
  } finally {
    await prisma.$disconnect();
  }
}
