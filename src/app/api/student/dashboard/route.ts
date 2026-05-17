import { NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";
import { verifyToken } from "@/lib/jwt";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const cookie = req.headers.get("cookie") || "";
    const match = cookie.match(/token=([^;]+)/);
    const token = match ? match[1] : null;
    const payload = token ? verifyToken(token) : null;

    if (!payload || payload.role !== "student" || typeof payload.id !== "number") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const student = await prisma.student.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        name: true,
        lastName: true,
        email: true,
        phone: true,
        nickname: true,
        address: true,
        city: true,
        birthDate: true,
        profilePhoto: true,
        planType: true,
        planStatus: true,
        planStartDate: true,
        planEndDate: true,
        enrollments: {
          include: {
            class: {
              include: {
                instructor: { select: { id: true, name: true } },
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
        payments: {
          orderBy: { date: "desc" },
          take: 5,
          select: {
            id: true,
            amount: true,
            date: true,
          },
        },
        anamneses: {
          take: 1,
          select: { id: true },
        },
      },
    });

    if (!student) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Profile completeness: fields that improve the profile
    const completenessFields: Record<string, boolean> = {
      phone: !!student.phone,
      nickname: !!student.nickname,
      address: !!student.address,
      city: !!student.city,
      birthDate: !!student.birthDate,
      photo: !!student.profilePhoto,
      anamnesis: student.anamneses.length > 0,
    };
    const completedCount = Object.values(completenessFields).filter(Boolean).length;
    const completenessPercent = Math.round((completedCount / Object.keys(completenessFields).length) * 100);

    return NextResponse.json({
      id: student.id,
      name: student.name,
      lastName: student.lastName,
      email: student.email,
      hasPhoto: !!student.profilePhoto,
      hasAnamnesis: student.anamneses.length > 0,
      plan: {
        type: student.planType,
        status: student.planStatus,
        startDate: student.planStartDate,
        endDate: student.planEndDate,
      },
      enrollments: student.enrollments.map((e) => ({
        id: e.id,
        classId: e.classId,
        className: e.class.name,
        schedule: e.class.schedule,
        instructorName: e.class.instructor?.name ?? null,
        capacity: e.class.capacity,
      })),
      payments: student.payments.map((p) => ({
        id: p.id,
        amount: p.amount,
        date: p.date,
      })),
      profile: {
        completenessPercent,
        fields: completenessFields,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
