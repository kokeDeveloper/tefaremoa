import { defineConfig } from '@prisma/config';
import dotenv from 'dotenv';
import path from 'path';

// Carga variables desde la raíz y luego desde prisma/.env (si existe)
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'prisma/.env'), override: true });

export default defineConfig({
  schema: './prisma/schema.prisma',
});
