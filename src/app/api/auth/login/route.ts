import { NextResponse } from 'next/server';
import { verifyAdminCredentials, signToken } from '../../../../lib/auth';
import { PrismaClient } from '../../../generated/prisma';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;
    const user = await verifyAdminCredentials(email, password);
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    // update lastLogin
    await prisma.admin.update({ where: { id: user.id }, data: { lastLogin: new Date() } });

    const token = signToken({ id: user.id, email: user.email, role: user.role });
    const res = NextResponse.json({ ok: true });
    res.cookies.set('token', token, { httpOnly: true, path: '/' });
    return res;
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
