import { NextResponse } from "next/server";
import { PrismaClient, type Prisma } from "@/app/generated/prisma";
import { verifyToken } from "@/lib/auth";

const prisma = new PrismaClient();

const LEVELS = new Set(["Por iniciar", "En proceso", "Logrado"] as const);

type RubricLevel = "Por iniciar" | "En proceso" | "Logrado";

type SequenceRubricKey =
  | "part1_brain"
  | "part1_directions"
  | "part1_rhythm"
  | "part2_brain"
  | "part2_directions"
  | "part2_rhythm"
  | "part3_brain"
  | "part3_directions"
  | "part3_rhythm";

type ChoreoRubricKey = "rhythm" | "basePosture" | "basicSteps" | "interpretation" | "manaPresence";

const SEQUENCE_KEYS: SequenceRubricKey[] = [
  "part1_brain",
  "part1_directions",
  "part1_rhythm",
  "part2_brain",
  "part2_directions",
  "part2_rhythm",
  "part3_brain",
  "part3_directions",
  "part3_rhythm",
];

const CHOREO_KEYS: ChoreoRubricKey[] = [
  "rhythm",
  "basePosture",
  "basicSteps",
  "interpretation",
  "manaPresence",
];

function getTokenFromRequest(req: Request): string | null {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/token=([^;]+)/);
  return match ? match[1] : null;
}

function requireAdmin(req: Request): NextResponse | null {
  const token = getTokenFromRequest(req);
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

function parseDateOnly(value: unknown): Date | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return null;
  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function validateRubric(
  rubric: unknown,
  keys: readonly string[]
): { ok: true; value: Record<string, RubricLevel> } | { ok: false; error: string } {
  if (!isPlainObject(rubric)) return { ok: false, error: "Rúbrica inválida" };

  for (const key of keys) {
    const level = rubric[key];
    if (typeof level !== "string" || !LEVELS.has(level as RubricLevel)) {
      return { ok: false, error: `Rúbrica inválida: "${key}" debe ser Por iniciar / En proceso / Logrado` };
    }
  }

  return { ok: true, value: rubric as Record<string, RubricLevel> };
}

export async function GET(req: Request) {
  try {
    const unauthorized = requireAdmin(req);
    if (unauthorized) return unauthorized;

    const url = new URL(req.url);
    const studentIdRaw = url.searchParams.get("studentId");
    const dateRaw = url.searchParams.get("date");
    const fromRaw = url.searchParams.get("from");
    const toRaw = url.searchParams.get("to");

    const where: Prisma.DanceEvaluationWhereInput = {};

    if (studentIdRaw) {
      const studentId = Number(studentIdRaw);
      if (!Number.isFinite(studentId)) {
        return NextResponse.json({ error: "studentId inválido" }, { status: 400 });
      }
      where.studentId = studentId;
    }

    if (dateRaw) {
      const date = parseDateOnly(dateRaw);
      if (!date) return NextResponse.json({ error: "date inválido (YYYY-MM-DD)" }, { status: 400 });
      where.evaluationDate = date;
    } else if (fromRaw || toRaw) {
      const from = fromRaw ? parseDateOnly(fromRaw) : null;
      const to = toRaw ? parseDateOnly(toRaw) : null;
      if (fromRaw && !from) return NextResponse.json({ error: "from inválido (YYYY-MM-DD)" }, { status: 400 });
      if (toRaw && !to) return NextResponse.json({ error: "to inválido (YYYY-MM-DD)" }, { status: 400 });
      where.evaluationDate = {
        ...(from ? { gte: from } : null),
        ...(to ? { lte: to } : null),
      } as any;
    }

    const items = await prisma.danceEvaluation.findMany({
      where,
      orderBy: [{ evaluationDate: "desc" }, { id: "desc" }],
      include: {
        student: { select: { id: true, name: true, lastName: true, email: true } },
      },
    });

    return NextResponse.json({ items });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(req: Request) {
  try {
    const unauthorized = requireAdmin(req);
    if (unauthorized) return unauthorized;

    const body = await req.json().catch(() => null);
    if (!isPlainObject(body)) {
      return NextResponse.json({ error: "Body inválido" }, { status: 400 });
    }

    const studentId = Number(body.studentId);
    if (!Number.isFinite(studentId) || studentId <= 0) {
      return NextResponse.json({ error: "studentId es requerido" }, { status: 400 });
    }

    const evaluationDate = parseDateOnly(body.evaluationDate);
    if (!evaluationDate) {
      return NextResponse.json({ error: "evaluationDate es requerido (YYYY-MM-DD)" }, { status: 400 });
    }

    const modality = body.modality;
    if (modality !== "INDIVIDUAL" && modality !== "PAIR") {
      return NextResponse.json({ error: "modality inválida" }, { status: 400 });
    }

    const partnerName = typeof body.partnerName === "string" ? body.partnerName.trim() : null;
    if (modality === "PAIR" && !partnerName) {
      return NextResponse.json({ error: "partnerName es requerido para modalidad PAIR" }, { status: 400 });
    }

    const seq = validateRubric(body.rubricSequences, SEQUENCE_KEYS);
    if (!seq.ok) return NextResponse.json({ error: seq.error }, { status: 400 });

    const choreo = validateRubric(body.rubricChoreo, CHOREO_KEYS);
    if (!choreo.ok) return NextResponse.json({ error: choreo.error }, { status: 400 });

    const observations = typeof body.observations === "string" ? body.observations.trim() : null;

    const existing = await prisma.danceEvaluation.findUnique({
      where: { studentId_evaluationDate: { studentId, evaluationDate } },
      select: { id: true },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Ya existe una evaluación para esa alumna en esa fecha." },
        { status: 409 }
      );
    }

    const created = await prisma.danceEvaluation.create({
      data: {
        studentId,
        evaluationDate,
        modality,
        partnerName: modality === "PAIR" ? partnerName : null,
        rubricSequences: seq.value,
        rubricChoreo: choreo.value,
        observations,
      },
      include: {
        student: { select: { id: true, name: true, lastName: true, email: true } },
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
