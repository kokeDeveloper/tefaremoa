import { NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";
import { verifyToken } from "@/lib/auth";
import fs from "fs";
import { getPhotoPath, getThumbPath } from "@/lib/galleryStorage";

function getAdminPayload(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/token=([^;]+)/);
  const token = match ? match[1] : null;
  const payload = token ? verifyToken(token) : null;
  if (!payload || (payload as any).role === "student") return null;
  return payload;
}

// GET /api/admin/gallery/[id]/photos/[photoId]/file → serve photo for admin preview
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string; photoId: string }> }
) {
  if (!getAdminPayload(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const prisma = new PrismaClient();
  try {
    const { id, photoId } = await params;
    const photo = await prisma.galleryPhoto.findFirst({
      where: { id: Number(photoId), eventId: Number(id) },
    });
    if (!photo) return NextResponse.json({ error: "No encontrada." }, { status: 404 });

    const thumb = new URL(req.url).searchParams.get("thumb") === "1";
    const thumbPath = getThumbPath(Number(id), photo.filename);
    const fullPath = getPhotoPath(Number(id), photo.filename);
    const filepath = thumb && fs.existsSync(thumbPath) ? thumbPath : fullPath;
    if (!fs.existsSync(filepath)) return NextResponse.json({ error: "Archivo no encontrado." }, { status: 404 });

    const buffer = fs.readFileSync(filepath);
    const mime = thumb ? "image/jpeg" : (photo.filename.endsWith(".png") ? "image/png" : photo.filename.endsWith(".webp") ? "image/webp" : "image/jpeg");

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": mime,
        "Cache-Control": "private, max-age=3600",
        "Content-Disposition": "inline",
      },
    });
  } finally {
    await prisma.$disconnect();
  }
}
