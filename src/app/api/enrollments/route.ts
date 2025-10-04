import { NextResponse } from 'next/server';
import { PrismaClient } from '../../generated/prisma';
import { verifyToken } from '../../../lib/auth';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const cookie = req.headers.get('cookie') || '';
    const match = cookie.match(/token=([^;]+)/);
    const token = match ? match[1] : null;
    if (!token || !verifyToken(token)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { studentId, classId } = body;
    if (!studentId || !classId) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    // Check capacity
    const cls = await prisma.class.findUnique({ where: { id: Number(classId) }, include: { enrollments: true } });
    if (!cls) return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    if (cls.enrollments.length >= cls.capacity) return NextResponse.json({ error: 'Class full' }, { status: 409 });

    // Check duplicate enrollment
    const existing = await prisma.enrollment.findFirst({ where: { studentId: Number(studentId), classId: Number(classId) } });
    if (existing) return NextResponse.json({ error: 'Already enrolled' }, { status: 409 });

    const enrollment = await prisma.enrollment.create({ data: { studentId: Number(studentId), classId: Number(classId) } });
    return NextResponse.json(enrollment, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
