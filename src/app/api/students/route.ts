import { NextResponse } from 'next/server';
import { PrismaClient } from '../../generated/prisma';
import { verifyToken } from '../../../lib/auth';
import { calculatePlanAlertWithStatus } from '../../../lib/planAlerts';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    // auth
    const cookie = req.headers.get('cookie') || '';
    const match = cookie.match(/token=([^;]+)/);
    const token = match ? match[1] : null;
    if (!token || !verifyToken(token)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const url = new URL(req.url);
    const skip = Number(url.searchParams.get('skip') || 0);
    const take = Number(url.searchParams.get('take') || 20);
    const search = url.searchParams.get('search') || '';

    const where = search
      ? { OR: [{ name: { contains: search } }, { email: { contains: search } }, { lastName: { contains: search } }] }
      : {};

    const [items, total] = await Promise.all([
      prisma.student.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
      prisma.student.count({ where }),
    ]);

    return NextResponse.json({ items, total });
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
  // accept both { name } or { firstName } from different clients
  const { name, firstName, lastName, email, phone, nickname, address, city, birthDate, planStartDate, planEndDate, planType, password } = body;
  const normalizedName = name || firstName;
  if (!normalizedName || !email || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    const existing = await prisma.student.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ error: 'Email already exists' }, { status: 409 });

  const plannedEnd = planEndDate ? new Date(planEndDate) : undefined;
  const { status } = calculatePlanAlertWithStatus(plannedEnd);

  const student = await prisma.student.create({ data: { name: normalizedName, lastName, email, phone, nickname, address, city, birthDate: birthDate ? new Date(birthDate) : undefined, planStartDate: planStartDate ? new Date(planStartDate) : undefined, planEndDate: plannedEnd, planType: planType || 'Basic', planStatus: status, password } });
    return NextResponse.json(student, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
