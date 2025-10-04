import { NextResponse } from 'next/server';
import { PrismaClient } from '../../../../../src/app/generated/prisma';
import { verifyToken } from '../../../../../src/lib/auth';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    // check cookie token from request
    // Next's server handlers receive Request; cookies are in headers
    const cookie = req.headers.get('cookie') || '';
    const match = cookie.match(/token=([^;]+)/);
    const token = match ? match[1] : null;
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const admin = await prisma.admin.findUnique({ where: { id: Number((payload as any).id) } });
    if (!admin) return NextResponse.json({ message: 'No admin found' }, { status: 404 });
    return NextResponse.json({ name: admin.name, email: admin.email });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
