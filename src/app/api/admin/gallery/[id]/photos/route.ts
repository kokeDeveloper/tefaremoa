import { NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";
import { verifyToken } from "@/lib/auth";
import fs from "fs";
import path from "path";
import { ensureEventDir, safeFilename, getPhotoPath } from "@/lib/galleryStorage";

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 15_000_000; // 15MB por foto

function getAdminPayload(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/token=([^;]+)/);
  const token = match ? match[1] : null;
  const payload = token ? verifyToken(token) : null;
  if (!payload || (payload as any).role === "student") return null;
  return payload;
}

// GET  /api/admin/gallery/[id]/photos  → list photos of event
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!getAdminPayload(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const prisma = new PrismaClient();
  try {
    const { id } = await params;
    const eventId = Number(id);
    const photos = await prisma.galleryPhoto.findMany({
      where: { eventId },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
    return NextResponse.json(photos);
  } finally {
    await prisma.$disconnect();
  }
}

// POST /api/admin/gallery/[id]/photos  → upload one photo
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!getAdminPayload(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const prisma = new PrismaClient();
  try {
    const { id } = await params;
    const eventId = Number(id);

    const event = await prisma.galleryEvent.findUnique({ where: { id: eventId } });
    if (!event) return NextResponse.json({ error: "Evento no encontrado." }, { status: 404 });

    let form: FormData;
    try {
      form = await req.formData();
    } catch {
      return NextResponse.json({ error: "No se pudo leer el archivo." }, { status: 400 });
    }

    const file = form.get("file");
    if (!(file instanceof Blob)) return NextResponse.json({ error: "Archivo requerido." }, { status: 400 });
    if (!ALLOWED_MIME.has(file.type)) return NextResponse.json({ error: "Solo JPG, PNG o WEBP." }, { status: 400 });
    if (file.size > MAX_BYTES) return NextResponse.json({ error: `Máximo 15 MB por foto.` }, { status: 400 });

    const originalName = (file as any).name || "photo.jpg";
    const filename = safeFilename(originalName);
    const dir = ensureEventDir(eventId);
    const filepath = path.join(dir, filename);

    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filepath, buffer);

    const title = (form.get("title") as string)?.trim() || null;
    const photo = await prisma.galleryPhoto.create({
      data: { eventId, filename, title, sizeBytes: file.size },
    });

    return NextResponse.json(photo, { status: 201 });
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE /api/admin/gallery/[id]/photos?photoId=X  → delete one photo
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!getAdminPayload(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const prisma = new PrismaClient();
  try {
    const { id } = await params;
    const eventId = Number(id);
    const photoId = Number(new URL(req.url).searchParams.get("photoId"));
    if (!photoId) return NextResponse.json({ error: "photoId requerido." }, { status: 400 });

    const photo = await prisma.galleryPhoto.findFirst({ where: { id: photoId, eventId } });
    if (!photo) return NextResponse.json({ error: "Foto no encontrada." }, { status: 404 });

    const filepath = getPhotoPath(eventId, photo.filename);
    if (fs.existsSync(filepath)) fs.unlinkSync(filepath);

    await prisma.galleryPhoto.delete({ where: { id: photoId } });
    return NextResponse.json({ ok: true });
  } finally {
    await prisma.$disconnect();
  }
}
