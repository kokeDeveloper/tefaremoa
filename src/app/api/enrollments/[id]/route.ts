import { NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';
import { verifyToken } from '@/lib/jwt';

const prisma = new PrismaClient();

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const cookie = req.headers.get('cookie') || '';
    const match = cookie.match(/token=([^;]+)/);
    const token = match ? match[1] : null;
    if (!token || !verifyToken(token)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const id = Number(params.id);
    const deleted = await prisma.enrollment.delete({ where: { id } });
    return NextResponse.json(deleted);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
