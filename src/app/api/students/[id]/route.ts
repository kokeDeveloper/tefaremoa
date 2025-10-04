import { NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';
import { verifyToken } from '@/lib/jwt';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const cookie = req.headers.get('cookie') || '';
    const match = cookie.match(/token=([^;]+)/);
    const token = match ? match[1] : null;
    if (!token || !verifyToken(token)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const id = Number(params.id);
    const student = await prisma.student.findUnique({ where: { id } });
    if (!student) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(student);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const cookie = req.headers.get('cookie') || '';
    const match = cookie.match(/token=([^;]+)/);
    const token = match ? match[1] : null;
    if (!token || !verifyToken(token)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const id = Number(params.id);
    const body = await req.json();
    const update: any = { ...body };
    if (body.password) {
      update.password = await bcrypt.hash(body.password, 10);
    }
    // convert date strings
    if (body.birthDate) update.birthDate = new Date(body.birthDate);
    if (body.planStartDate) update.planStartDate = new Date(body.planStartDate);
    if (body.planEndDate) update.planEndDate = new Date(body.planEndDate);

    const student = await prisma.student.update({ where: { id }, data: update });
    return NextResponse.json(student);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const cookie = req.headers.get('cookie') || '';
    const match = cookie.match(/token=([^;]+)/);
    const token = match ? match[1] : null;
    if (!token || !verifyToken(token)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const id = Number(params.id);
    // remove related records first
    await prisma.enrollment.deleteMany({ where: { studentId: id } });
    await prisma.payment.deleteMany({ where: { studentId: id } });
    await prisma.attendance.deleteMany({ where: { studentId: id } });
    const deleted = await prisma.student.delete({ where: { id } });
    return NextResponse.json(deleted);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
