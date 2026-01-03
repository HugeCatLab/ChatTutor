# ============================================
# Dockerfile for @chat-tutor/client (API Server)
# Uses Bun runtime with Elysia framework
# ============================================

# Stage 1: Install dependencies (use Node for pnpm)
FROM node:22-alpine AS deps

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

# Copy workspace configuration files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# Copy all package.json files for workspace packages
COPY packages/client/package.json ./packages/client/
COPY packages/agent/package.json ./packages/agent/
COPY packages/db/package.json ./packages/db/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Stage 2: Build
FROM oven/bun:1 AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/client/node_modules ./packages/client/node_modules
COPY --from=deps /app/packages/agent/node_modules ./packages/agent/node_modules
COPY --from=deps /app/packages/db/node_modules ./packages/db/node_modules
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules

# Copy source code
COPY packages/client ./packages/client
COPY packages/agent ./packages/agent
COPY packages/db ./packages/db
COPY packages/shared ./packages/shared
COPY package.json pnpm-workspace.yaml ./

# Build the client
WORKDIR /app/packages/client
RUN bun build src/index.ts --outdir dist --target bun --minify

# Stage 3: Production
FROM oven/bun:1-slim AS runner

WORKDIR /app

# Create non-root user for security
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --gid nodejs chattutor

# Copy built artifacts and necessary files
COPY --from=builder /app/packages/client/dist ./dist
COPY --from=builder /app/packages/client/package.json ./

# Copy workspace dependencies (needed at runtime for TypeScript resolution)
COPY --from=builder /app/node_modules ./node_modules
COPY --from=deps /app/packages/agent/node_modules ../agent/node_modules
COPY --from=deps /app/packages/db/node_modules ../db/node_modules
COPY --from=deps /app/packages/shared/node_modules ../shared/node_modules
COPY --from=builder /app/packages/agent ../agent
COPY --from=builder /app/packages/db ../db
COPY --from=builder /app/packages/shared ../shared

USER chattutor

# Expose API port
EXPOSE 8002

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD bun --eval "fetch('http://localhost:8002').then(() => process.exit(0)).catch(() => process.exit(1))"

# Start the server
CMD ["bun", "run", "dist/index.js"]
