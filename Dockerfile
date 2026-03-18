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

# Standalone build (server.js + minimal node_modules)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Prisma: config, schema, migrations, and generated client
COPY --from=builder --chown=nextjs:nodejs /app/prisma.config.ts      ./prisma.config.ts
COPY --from=builder --chown=nextjs:nodejs /app/prisma/schema.prisma  ./prisma/schema.prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma/migrations      ./prisma/migrations
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma  ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma  ./node_modules/@prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/prisma   ./node_modules/prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/dotenv   ./node_modules/dotenv
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/tsx      ./node_modules/tsx

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Run migrations (idempotent) then start the server
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
