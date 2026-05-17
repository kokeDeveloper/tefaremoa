import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/app/generated/prisma";

const prisma = new PrismaClient();

// ─── Planes de la academia (precios en CLP) ───────────────────────────────────
const PLANS = [
  {
    name: "1x",
    label: "1 vez/semana",
    price: 40000,
    sessionsPerWeek: 1,
    isScholarship: false,
    description: "Una clase por semana",
  },
  {
    name: "2x",
    label: "2 veces/semana",
    price: 50000,
    sessionsPerWeek: 2,
    isScholarship: false,
    description: "Dos clases por semana",
  },
  {
    name: "3x",
    label: "3 veces/semana",
    price: 62000,
    sessionsPerWeek: 3,
    isScholarship: false,
    description: "Tres clases por semana",
  },
  {
    name: "4x",
    label: "4 veces/semana",
    price: 75000,
    sessionsPerWeek: 4,
    isScholarship: false,
    description: "Cuatro clases por semana",
  },
  {
    name: "Beca",
    label: "Beca",
    price: 40000,
    sessionsPerWeek: null,
    isScholarship: true,
    description: "Beca equivalente al plan 1 vez/semana ($40.000 CLP)",
  },
] as const;

async function seedPlans() {
  console.log("Seeding plans…");
  for (const plan of PLANS) {
    await prisma.plan.upsert({
      where: { name: plan.name },
      update: {
        label: plan.label,
        price: plan.price,
        sessionsPerWeek: plan.sessionsPerWeek ?? null,
        isScholarship: plan.isScholarship,
        description: plan.description,
      },
      create: {
        name: plan.name,
        label: plan.label,
        price: plan.price,
        sessionsPerWeek: plan.sessionsPerWeek ?? null,
        isScholarship: plan.isScholarship,
        description: plan.description,
      },
    });
    console.log(`  ✓ Plan "${plan.name}" — $${plan.price.toLocaleString("es-CL")} CLP`);
  }
}

async function seedAdmin() {
  const email = "napatalama@gmail.com";
  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) {
    console.log("Admin already exists:", existing.email);
    return;
  }

  const passwordPlain = "123momia";
  const hashed = await bcrypt.hash(passwordPlain, 10);

  const admin = await prisma.admin.create({
    data: {
      name: "Ángela Ortiz",
      email,
      password: hashed,
      role: "ADMIN",
      isActive: true,
    },
  });
  console.log("Seeded admin:", admin.email);
}

async function main() {
  await seedAdmin();
  await seedPlans();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });