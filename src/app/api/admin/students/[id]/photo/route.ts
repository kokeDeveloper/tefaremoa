import { NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";
import { verifyToken } from "@/lib/auth";

function getAdminPayload(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/token=([^;]+)/);
  const token = match ? match[1] : null;
  const payload = token ? verifyToken(token) : null;
  if (!payload) return null;
  if ((payload as any).role === "student") return null;
  return payload;
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const prisma = new PrismaClient();
  try {
    const adminPayload = getAdminPayload(req);
    if (!adminPayload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const studentId = Number(id);
    if (!studentId || isNaN(studentId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: { profilePhoto: true, profilePhotoMime: true },
    });

    if (!student?.profilePhoto || !student?.profilePhotoMime) {
      return NextResponse.json({ error: "Sin foto" }, { status: 404 });
    }

    const buffer = Buffer.isBuffer(student.profilePhoto)
      ? student.profilePhoto
      : Buffer.from(student.profilePhoto as any);

    const headers = new Headers();
    headers.set("Content-Type", student.profilePhotoMime);
    headers.set("Cache-Control", "private, max-age=300");

    return new NextResponse(buffer, { status: 200, headers });
  } catch (err) {
    console.error("[admin photo GET]", String(err));
    return NextResponse.json({ error: String(err) }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
