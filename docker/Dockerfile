# Stage 1: Dependencies
FROM node:20-alpine AS deps

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.8.1 --activate

# Install build dependencies for native modules
RUN apk add --no-cache python3 make g++ netcat-openbsd

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/agent/package.json ./packages/agent/
COPY packages/canvas/package.json ./packages/canvas/
COPY packages/mermaid/package.json ./packages/mermaid/
COPY packages/shared/package.json ./packages/shared/
COPY packages/pkg/package.json ./packages/pkg/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Stage 2: Builder
FROM node:20-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.8.1 --activate

# Install build dependencies
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages

# Copy all source files
COPY . .

# Build the application
RUN pnpm build

# Stage 3: Production
FROM node:20-alpine AS runner

# Install pnpm and netcat for database health check
RUN corepack enable && corepack prepare pnpm@10.8.1 --activate && \
    apk add --no-cache netcat-openbsd

WORKDIR /app

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nuxtjs

# Copy necessary files from builder
COPY --from=builder --chown=nuxtjs:nodejs /app/.output /app/.output
COPY --from=builder --chown=nuxtjs:nodejs /app/package.json /app/
COPY --from=builder --chown=nuxtjs:nodejs /app/pnpm-lock.yaml /app/
COPY --from=builder --chown=nuxtjs:nodejs /app/pnpm-workspace.yaml /app/
COPY --from=builder --chown=nuxtjs:nodejs /app/shared /app/shared
COPY --from=builder --chown=nuxtjs:nodejs /app/server /app/server
COPY --from=builder --chown=nuxtjs:nodejs /app/drizzle.config.ts /app/
COPY --from=builder --chown=nuxtjs:nodejs /app/node_modules /app/node_modules
COPY --from=builder --chown=nuxtjs:nodejs /app/packages /app/packages

# Copy entrypoint script
COPY docker/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh && \
    chown nuxtjs:nodejs /usr/local/bin/docker-entrypoint.sh

# Switch to non-root user
USER nuxtjs

# Expose the application port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Set entrypoint
ENTRYPOINT ["docker-entrypoint.sh"]

# Start the application
CMD ["node", ".output/server/index.mjs"]

