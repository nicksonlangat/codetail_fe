FROM node:20-slim AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001

RUN addgroup --system --gid 1001 codetail && \
    adduser --system --uid 1001 codetail

COPY --from=builder /app/public ./public
COPY --from=builder --chown=codetail:codetail /app/.next/standalone ./
COPY --from=builder --chown=codetail:codetail /app/.next/static ./.next/static

USER codetail

EXPOSE 3001

CMD ["node", "server.js"]
