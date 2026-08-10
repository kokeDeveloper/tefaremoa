import { NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";
import { verifyToken } from "@/lib/auth";
import fs from "fs";
import { getEventDir } from "@/lib/galleryStorage";

function getAdminPayload(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/token=([^;]+)/);
  const token = match ? match[1] : null;
  const payload = token ? verifyToken(token) : null;
  if (!payload || (payload as any).role === "student") return null;
  return payload;
}

// GET  /api/admin/gallery       → list all events
// POST /api/admin/gallery       → create event
export async function GET(req: Request) {
  if (!getAdminPayload(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const prisma = new PrismaClient();
  try {
    const events = await prisma.galleryEvent.findMany({
      orderBy: { eventDate: "desc" },
      include: { _count: { select: { photos: true } } },
    });
    return NextResponse.json(events);
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(req: Request) {
  if (!getAdminPayload(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const prisma = new PrismaClient();
  try {
    const body = await req.json();
    const { name, description, eventDate } = body;
    if (!name?.trim()) return NextResponse.json({ error: "Nombre requerido." }, { status: 400 });
    const event = await prisma.galleryEvent.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        eventDate: eventDate ? new Date(eventDate) : null,
      },
    });
    return NextResponse.json(event, { status: 201 });
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE /api/admin/gallery?id=X  → delete event + files
export async function DELETE(req: Request) {
  if (!getAdminPayload(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const prisma = new PrismaClient();
  try {
    const id = Number(new URL(req.url).searchParams.get("id"));
    if (!id) return NextResponse.json({ error: "ID requerido." }, { status: 400 });
    await prisma.galleryPhoto.deleteMany({ where: { eventId: id } });
    await prisma.galleryEvent.delete({ where: { id } });
    // Remove files from disk
    const dir = getEventDir(id);
    if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
    return NextResponse.json({ ok: true });
  } finally {
    await prisma.$disconnect();
  }
}

// PATCH /api/admin/gallery?id=X  → update event metadata / published
export async function PATCH(req: Request) {
  if (!getAdminPayload(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const prisma = new PrismaClient();
  try {
    const id = Number(new URL(req.url).searchParams.get("id"));
    if (!id) return NextResponse.json({ error: "ID requerido." }, { status: 400 });
    const body = await req.json();
    const data: any = {};
    if (body.name !== undefined) data.name = body.name.trim();
    if (body.description !== undefined) data.description = body.description?.trim() || null;
    if (body.eventDate !== undefined) data.eventDate = body.eventDate ? new Date(body.eventDate) : null;
    if (body.isPublished !== undefined) data.isPublished = Boolean(body.isPublished);
    const event = await prisma.galleryEvent.update({ where: { id }, data });
    return NextResponse.json(event);
  } finally {
    await prisma.$disconnect();
  }
}
