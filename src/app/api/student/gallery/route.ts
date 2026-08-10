import { NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";
import { verifyToken } from "@/lib/jwt";

function getStudentPayload(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/token=([^;]+)/);
  const token = match ? match[1] : null;
  const payload = token ? verifyToken(token) : null;
  if (!payload || (payload as any).role !== "student") return null;
  return payload as { id: number; role: "student" };
}

// GET /api/student/gallery  → list published events
export async function GET(req: Request) {
  if (!getStudentPayload(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const prisma = new PrismaClient();
  try {
    const events = await prisma.galleryEvent.findMany({
      where: { isPublished: true },
      orderBy: { eventDate: "desc" },
      include: { _count: { select: { photos: true } } },
    });
    return NextResponse.json(events);
  } finally {
    await prisma.$disconnect();
  }
}
