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
  const normalizedEmail = (email ?? '').trim().toLowerCase();
  const providedPassword = password ?? '';

  // Abort early if data is missing
  if (!normalizedEmail || !providedPassword) {
    return null;
  }

  const admin = await prisma.admin.findUnique({ where: { email: normalizedEmail } });
  if (!admin || !admin.isActive) {
    return null;
  }

  const storedPassword = admin.password || '';
  const isBcryptHash = storedPassword.startsWith('$2a$') || storedPassword.startsWith('$2b$') || storedPassword.startsWith('$2y$');

  // Support legacy plaintext passwords once, then migrate them to bcrypt
  const passwordMatch = isBcryptHash
    ? await bcrypt.compare(providedPassword, storedPassword)
    : storedPassword === providedPassword;

  if (!passwordMatch) {
    return null;
  }

  // If the password was plaintext, hash it now to harden future logins
  if (!isBcryptHash) {
    const hashed = await bcrypt.hash(providedPassword, 10);
    await prisma.admin.update({ where: { id: admin.id }, data: { password: hashed } });
  }

  return {
    id: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
  };
}