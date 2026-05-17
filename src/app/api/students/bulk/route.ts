import { NextResponse } from 'next/server';
import { PrismaClient } from '../../../generated/prisma';
import { verifyToken } from '../../../../lib/auth';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { calculatePlanAlertWithStatus } from '../../../../lib/planAlerts';

const prisma = new PrismaClient();

const VALID_PLAN_TYPES = ['1x', '2x', '3x', '4x', 'Beca'];

/**
 * Minimal RFC-4180-compliant CSV parser.
 * Returns an array of row arrays (strings).
 */
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  for (const line of lines) {
    if (line.trim() === '') continue;
    const fields: string[] = [];
    let i = 0;
    while (i < line.length) {
      if (line[i] === '"') {
        // quoted field
        i++;
        let field = '';
        while (i < line.length) {
          if (line[i] === '"' && line[i + 1] === '"') {
            field += '"';
            i += 2;
          } else if (line[i] === '"') {
            i++;
            break;
          } else {
            field += line[i];
            i++;
          }
        }
        fields.push(field);
        if (line[i] === ',') i++;
      } else {
        const end = line.indexOf(',', i);
        if (end === -1) {
          fields.push(line.slice(i));
          break;
        } else {
          fields.push(line.slice(i, end));
          i = end + 1;
        }
      }
    }
    rows.push(fields);
  }
  return rows;
}

const EXPECTED_HEADERS = [
  'nombre', 'apellidos', 'email', 'telefono', 'apodo',
  'direccion', 'ciudad', 'fechaNacimiento', 'inicioPlan', 'finPlan', 'tipoPlan',
];

export async function POST(req: Request) {
  try {
    // Auth check
    const cookie = req.headers.get('cookie') || '';
    const match = cookie.match(/token=([^;]+)/);
    const token = match ? match[1] : null;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file');
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No se recibió ningún archivo.' }, { status: 400 });
    }

    const text = await (file as File).text();
    const rows = parseCSV(text);

    if (rows.length < 2) {
      return NextResponse.json({ error: 'El archivo está vacío o solo tiene encabezados.' }, { status: 400 });
    }

    // Validate header row (case-insensitive, trimmed)
    const headers = rows[0].map((h) => h.trim().toLowerCase());
    const missingHeaders = EXPECTED_HEADERS.filter(
      (h) => !headers.includes(h.toLowerCase())
    );
    if (missingHeaders.length > 0) {
      return NextResponse.json(
        { error: `Faltan columnas: ${missingHeaders.join(', ')}. Descarga la plantilla para ver el formato correcto.` },
        { status: 400 }
      );
    }

    // Map header positions
    const col = (name: string) => headers.indexOf(name.toLowerCase());

    const dataRows = rows.slice(1);
    const results: { row: number; email: string; status: 'created' | 'skipped'; reason?: string }[] = [];

    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      const rowNum = i + 2; // 1-indexed, +1 for header

      const nombre = row[col('nombre')]?.trim() || '';
      const apellidos = row[col('apellidos')]?.trim() || '';
      const email = row[col('email')]?.trim().toLowerCase() || '';

      if (!nombre || !email) {
        results.push({ row: rowNum, email: email || '—', status: 'skipped', reason: 'nombre y email son obligatorios' });
        continue;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        results.push({ row: rowNum, email, status: 'skipped', reason: 'email inválido' });
        continue;
      }

      const telefono = row[col('telefono')]?.trim() || null;
      const apodo = row[col('apodo')]?.trim() || null;
      const direccion = row[col('direccion')]?.trim() || null;
      const ciudad = row[col('ciudad')]?.trim() || null;

      const fechaNacimientoRaw = row[col('fechaNacimiento')]?.trim() || '';
      const inicioPlanRaw = row[col('inicioPlan')]?.trim() || '';
      const finPlanRaw = row[col('finPlan')]?.trim() || '';
      const tipoPlan = row[col('tipoPlan')]?.trim() || '1x';

      const parseOptionalDate = (s: string) => {
        if (!s) return undefined;
        const d = new Date(s);
        return isNaN(d.getTime()) ? undefined : d;
      };

      const birthDate = parseOptionalDate(fechaNacimientoRaw);
      const planStartDate = parseOptionalDate(inicioPlanRaw);
      const planEndDate = parseOptionalDate(finPlanRaw);

      const resolvedPlanType = VALID_PLAN_TYPES.includes(tipoPlan) ? tipoPlan : '1x';

      try {
        const existing = await prisma.student.findUnique({ where: { email } });
        if (existing) {
          results.push({ row: rowNum, email, status: 'skipped', reason: 'email ya registrado' });
          continue;
        }

        const rawPassword = randomBytes(8).toString('hex');
        const hashedPassword = await bcrypt.hash(rawPassword, 10);
        const { status: planStatus } = calculatePlanAlertWithStatus(planEndDate);

        await prisma.student.create({
          data: {
            name: nombre,
            lastName: apellidos || "",
            email,
            phone: telefono,
            nickname: apodo,
            address: direccion,
            city: ciudad,
            birthDate,
            planStartDate,
            planEndDate,
            planType: resolvedPlanType,
            planStatus,
            password: hashedPassword,
            mustChangePassword: true,
          },
        });

        results.push({ row: rowNum, email, status: 'created' });
      } catch (err: any) {
        results.push({ row: rowNum, email, status: 'skipped', reason: String(err?.message || err) });
      }
    }

    const created = results.filter((r) => r.status === 'created').length;
    const skipped = results.filter((r) => r.status === 'skipped').length;

    return NextResponse.json({ created, skipped, results }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
