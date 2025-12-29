import { NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";
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

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const unauthorized = requireAdmin(req);
    if (unauthorized) return unauthorized;

    const { id } = await params;
    const idNum = Number(id);
    if (!Number.isFinite(idNum)) {
      return NextResponse.json({ error: "id inválido" }, { status: 400 });
    }

    const item = await prisma.danceEvaluation.findUnique({
      where: { id: idNum },
      include: { student: { select: { id: true, name: true, lastName: true, email: true } } },
    });

    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(item);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const unauthorized = requireAdmin(req);
    if (unauthorized) return unauthorized;

    const { id } = await params;
    const idNum = Number(id);
    if (!Number.isFinite(idNum)) {
      return NextResponse.json({ error: "id inválido" }, { status: 400 });
    }

    const body = await req.json().catch(() => null);
    if (!isPlainObject(body)) {
      return NextResponse.json({ error: "Body inválido" }, { status: 400 });
    }

    const update: any = {};

    if (body.studentId !== undefined) {
      const studentId = Number(body.studentId);
      if (!Number.isFinite(studentId) || studentId <= 0) {
        return NextResponse.json({ error: "studentId inválido" }, { status: 400 });
      }
      update.studentId = studentId;
    }

    if (body.evaluationDate !== undefined) {
      const evaluationDate = parseDateOnly(body.evaluationDate);
      if (!evaluationDate) {
        return NextResponse.json({ error: "evaluationDate inválido (YYYY-MM-DD)" }, { status: 400 });
      }
      update.evaluationDate = evaluationDate;
    }

    if (body.modality !== undefined) {
      const modality = body.modality;
      if (modality !== "INDIVIDUAL" && modality !== "PAIR") {
        return NextResponse.json({ error: "modality inválida" }, { status: 400 });
      }
      update.modality = modality;
    }

    if (body.partnerName !== undefined) {
      update.partnerName = typeof body.partnerName === "string" ? body.partnerName.trim() : null;
    }

    if (body.rubricSequences !== undefined) {
      const seq = validateRubric(body.rubricSequences, SEQUENCE_KEYS);
      if (!seq.ok) return NextResponse.json({ error: seq.error }, { status: 400 });
      update.rubricSequences = seq.value;
    }

    if (body.rubricChoreo !== undefined) {
      const choreo = validateRubric(body.rubricChoreo, CHOREO_KEYS);
      if (!choreo.ok) return NextResponse.json({ error: choreo.error }, { status: 400 });
      update.rubricChoreo = choreo.value;
    }

    if (body.observations !== undefined) {
      update.observations = typeof body.observations === "string" ? body.observations.trim() : null;
    }

    if (update.modality === "PAIR" && (update.partnerName === null || update.partnerName === "")) {
      return NextResponse.json({ error: "partnerName es requerido para modalidad PAIR" }, { status: 400 });
    }

    if (update.modality === "INDIVIDUAL") {
      update.partnerName = null;
    }

    const updated = await prisma.danceEvaluation.update({
      where: { id: idNum },
      data: update,
      include: { student: { select: { id: true, name: true, lastName: true, email: true } } },
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    const message = String(err?.message || err);
    if (message.includes("Unique constraint") || message.includes("P2002")) {
      return NextResponse.json(
        { error: "Ya existe una evaluación para esa alumna en esa fecha." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: String(err) }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
