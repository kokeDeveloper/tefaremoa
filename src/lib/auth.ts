import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '../app/generated/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

// Ajustable si deseas cambiar expiración
const DEFAULT_EXP = '7d';

declare global {
  // eslint-disable-next-line no-var
  var prismaAuthClient: PrismaClient | undefined;
}

const prisma = globalThis.prismaAuthClient ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaAuthClient = prisma;
}

export interface AdminTokenPayload {
  id: number;
  email: string;
  role?: string;
  name?: string;
  iat?: number;
  exp?: number;
}

export interface AdminAuthResult {
  id: number;
  email: string;
  name: string;
  role: string;
}

export function signToken(
  payload: Omit<AdminTokenPayload, 'iat' | 'exp'>,
  options?: jwt.SignOptions
) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: DEFAULT_EXP, ...(options ?? {}) });
}

export function verifyToken(token: string): AdminTokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminTokenPayload;
  } catch {
    return null;
  }
}

export async function verifyAdminCredentials(
  email: string,
  password: string
): Promise<AdminAuthResult | null> {
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin || !admin.isActive) {
    return null;
  }

  const passwordMatch = await bcrypt.compare(password, admin.password);
  if (!passwordMatch) {
    return null;
  }

  return {
    id: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
  };
}