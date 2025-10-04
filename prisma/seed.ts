import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/app/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  const passwordPlain = "123momia";
  const hashed = await bcrypt.hash(passwordPlain, 10);

  const email = "napatalama@gmail.com";

  // Avoid duplicate seed on re-run
  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) {
    console.log("Admin already exists:", existing.email);
    return;
  }

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

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });