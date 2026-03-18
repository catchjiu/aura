# syntax=docker/dockerfile:1

# ── Stage 1: install dependencies ────────────────────────────────────────────
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
# Disable postinstall (prisma generate) during dep install — no schema yet
RUN npm ci --ignore-scripts

# ── Stage 2: build ────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# Make DATABASE_URL available during Next.js "Collecting page data" step.
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

# Generate Prisma client from schema, then build Next.js
RUN npx prisma generate
RUN npm run build

# ── Stage 3: production runner ────────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Least-privilege user
RUN addgroup --system --gid 1001 nodejs
RUN adduser  --system --uid 1001 nextjs

# Static assets
COPY --from=builder /app/public ./public

# Standalone build (server.js + bundled node_modules)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static     ./.next/static

# DB setup script (plain ESM — no Prisma CLI / tsx / esbuild needed)
COPY --from=builder --chown=nextjs:nodejs /app/prisma/setup.mjs ./prisma/setup.mjs

# Prisma generated client
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma  ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma  ./node_modules/@prisma

# pg driver (used by setup.mjs and the Prisma adapter at runtime)
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/pg                   ./node_modules/pg
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/pg-cloudflare        ./node_modules/pg-cloudflare
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/pg-connection-string ./node_modules/pg-connection-string
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/pg-int8              ./node_modules/pg-int8
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/pg-numeric           ./node_modules/pg-numeric
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/pg-pool              ./node_modules/pg-pool
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/pg-protocol          ./node_modules/pg-protocol
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/pg-types             ./node_modules/pg-types
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/pgpass               ./node_modules/pgpass

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Run DB setup (creates tables + seeds if empty) then start the server.
# Uses pg directly — zero dependency on Prisma CLI, tsx, or esbuild.
CMD ["sh", "-c", "node ./prisma/setup.mjs ; node server.js"]
