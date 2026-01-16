FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm
RUN corepack enable pnpm

# Copy package files first
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backoffice/package.json ./apps/backoffice/
COPY packages/api/package.json ./packages/api/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/typescript-config/package.json ./packages/typescript-config/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Install pnpm
RUN corepack enable pnpm

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backoffice/package.json ./apps/backoffice/
COPY packages/api/package.json ./packages/api/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/typescript-config/package.json ./packages/typescript-config/

# Install dependencies
RUN pnpm install --frozen-lockfile --ignore-scripts

# Copy the rest of the monorepo
COPY . .

# Set environment variables
ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_BASE_PATH

# Build the application
RUN pnpm turbo run build --filter=backoffice

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone output and static files
COPY --from=builder --chown=nextjs:nodejs /app/apps/backoffice/.next/standalone ./apps/backoffice/.next/standalone
COPY --from=builder --chown=nextjs:nodejs /app/apps/backoffice/.next/static ./apps/backoffice/.next/standalone/apps/backoffice/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/backoffice/public ./apps/backoffice/.next/standalone/apps/backoffice/public

# Create cache directory with proper ownership for volume mount
RUN mkdir -p /app/apps/backoffice/.next/standalone/apps/backoffice/.next/cache && \
    chown -R nextjs:nodejs /app/apps/backoffice/.next/standalone/apps/backoffice/.next/cache

WORKDIR /app/apps/backoffice/.next/standalone

USER nextjs

EXPOSE 3001

ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

# server.js is created by next build from the standalone output
CMD ["node", "apps/backoffice/server.js"]