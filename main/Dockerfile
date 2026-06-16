FROM node:20-alpine AS base

ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

# -------------------------
# Dependencies
# -------------------------
FROM base AS deps

RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json ./
COPY prisma ./prisma

RUN npm ci

# -------------------------
# Build
# -------------------------
FROM base AS builder

RUN apk add --no-cache libc6-compat

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js
RUN npm run build

# -------------------------
# Production
# -------------------------
FROM base AS runner

ENV NODE_ENV=production
ENV PORT=3000

RUN apk add --no-cache libc6-compat

RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

# Entrypoint
RUN printf '#!/bin/sh\nset -e\nnpx prisma migrate deploy\nexec npm run start\n' > /app/docker-entrypoint.sh \
    && chmod +x /app/docker-entrypoint.sh

USER nextjs

EXPOSE 3000

CMD ["./docker-entrypoint.sh"]