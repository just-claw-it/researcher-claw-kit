# Researcher Kit — Next.js web UI (runs on any host: Oracle Cloud, AWS, bare metal, etc.)
# Build from repository root: docker build -t researcher-kit .
# Run: docker run --rm -p 3000:3000 researcher-kit

FROM node:20-alpine AS deps
WORKDIR /app
COPY web/package.json web/package-lock.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY web/ ./
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Skills + standards live here at runtime (see web/src/lib/skills.ts)
ENV RESEARCHER_KIT_ROOT=/app/researcher-kit

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

COPY .claude ./researcher-kit/.claude
COPY standards ./researcher-kit/standards

RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
