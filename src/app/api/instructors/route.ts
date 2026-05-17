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

    const instructors = await prisma.instructor.findMany({ orderBy: { name: 'asc' } });
    return NextResponse.json(instructors);
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
    const { name, email, phone } = body;
    if (!name || !email) return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });

    const existing = await prisma.instructor.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ error: 'Email already in use' }, { status: 409 });

    const instructor = await prisma.instructor.create({ data: { name, email, phone: phone || null } });
    return NextResponse.json(instructor, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
