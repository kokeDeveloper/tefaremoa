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

    const url = new URL(req.url);
    const studentId = url.searchParams.get('studentId');
    const from = url.searchParams.get('from');
    const to = url.searchParams.get('to');

    const where: any = {};
    if (studentId) where.studentId = Number(studentId);
    if (from || to) where.date = {};
    if (from) where.date.gte = new Date(from);
    if (to) where.date.lte = new Date(to);

    const payments = await prisma.payment.findMany({ where, orderBy: { date: 'desc' } });
    return NextResponse.json(payments);
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
    const { studentId, amount, date } = body;
    if (!studentId || !amount) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    if (Number(amount) <= 0) return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });

    const payment = await prisma.payment.create({ data: { studentId: Number(studentId), amount: Number(amount), date: date ? new Date(date) : undefined } });
    return NextResponse.json(payment, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
