import { defineConfig } from '@prisma/config';

export default defineConfig({
  schema: './prisma/schema.prisma',
  seed: {
    provider: 'ts-node',
    run: 'tsx prisma/seed.ts',
  },
});
