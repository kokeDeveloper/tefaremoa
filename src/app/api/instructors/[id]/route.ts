import { NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';
import { verifyToken } from '@/lib/jwt';

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookie = req.headers.get('cookie') || '';
    const match = cookie.match(/token=([^;]+)/);
    const token = match ? match[1] : null;
    if (!token || !verifyToken(token)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const instructor = await prisma.instructor.findUnique({
      where: { id: Number(id) },
      include: { classes: { select: { id: true, name: true, schedule: true } } },
    });
    if (!instructor) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(instructor);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookie = req.headers.get('cookie') || '';
    const match = cookie.match(/token=([^;]+)/);
    const token = match ? match[1] : null;
    if (!token || !verifyToken(token)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const { name, email, phone } = body;

    if (email) {
      const conflict = await prisma.instructor.findFirst({ where: { email, NOT: { id: Number(id) } } });
      if (conflict) return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
    }

    const updated = await prisma.instructor.update({
      where: { id: Number(id) },
      data: { ...(name && { name }), ...(email && { email }), phone: phone ?? null },
    });
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookie = req.headers.get('cookie') || '';
    const match = cookie.match(/token=([^;]+)/);
    const token = match ? match[1] : null;
    if (!token || !verifyToken(token)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const idNum = Number(id);

    const classCount = await prisma.class.count({ where: { instructorId: idNum } });
    if (classCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete instructor with assigned classes. Reassign or delete the classes first.' },
        { status: 409 }
      );
    }

    const deleted = await prisma.instructor.delete({ where: { id: idNum } });
    return NextResponse.json(deleted);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
