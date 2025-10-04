import { NextResponse } from 'next/server';
import { PrismaClient } from '../../generated/prisma';
import { verifyToken } from '../../../lib/auth';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const cookie = req.headers.get('cookie') || '';
    const match = cookie.match(/token=([^;]+)/);
    const token = match ? match[1] : null;
    if (!token || !verifyToken(token)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const classes = await prisma.class.findMany({ orderBy: { schedule: 'asc' } });
    return NextResponse.json(classes);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(req: Request) {
  try {
    const cookie = req.headers.get('cookie') || '';
    const match = cookie.match(/token=([^;]+)/);
    const token = match ? match[1] : null;
    if (!token || !verifyToken(token)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { name, schedule, capacity, instructorId } = body;
    if (!name || !schedule || !capacity || !instructorId) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    const cls = await prisma.class.create({ data: { name, schedule: new Date(schedule), capacity: Number(capacity), instructorId: Number(instructorId) } });
    return NextResponse.json(cls, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
