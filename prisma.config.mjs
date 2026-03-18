// Plain ESM — no tsx needed, works in the slim Docker runner.
// DATABASE_URL is read directly from process.env (set by Coolify at runtime).
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
