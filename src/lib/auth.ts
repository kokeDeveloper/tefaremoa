import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

// Ajustable si deseas cambiar expiración
const DEFAULT_EXP = '7d';

export interface AdminTokenPayload {
  id: number;
  email: string;
  role?: string;
  name?: string;
  iat?: number;
  exp?: number;
}

export function signToken(payload: Omit<AdminTokenPayload, 'iat' | 'exp'>) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: DEFAULT_EXP });
}

export function verifyToken(token: string): AdminTokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminTokenPayload;
  } catch {
    return null;
  }
}