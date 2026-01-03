# ============================================
# Dockerfile for @chat-tutor/web (Vue.js Frontend)
# Multi-stage build with nginx for production
# ============================================

# Stage 1: Install dependencies
FROM node:22-alpine AS deps

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

# Copy workspace configuration files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# Copy all package.json files for workspace packages
COPY packages/web/package.json ./packages/web/
COPY packages/ui/package.json ./packages/ui/
COPY packages/shared/package.json ./packages/shared/
COPY packages/client/package.json ./packages/client/
COPY packages/ggb-applet/package.json ./packages/ggb-applet/
COPY packages/agent/package.json ./packages/agent/
COPY packages/db/package.json ./packages/db/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Stage 2: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages

# Copy source code
COPY packages/web ./packages/web
COPY packages/ui ./packages/ui
COPY packages/shared ./packages/shared
COPY packages/client ./packages/client
COPY packages/ggb-applet ./packages/ggb-applet
COPY packages/agent ./packages/agent
COPY packages/db ./packages/db
COPY package.json pnpm-workspace.yaml tsconfig.json ./

# Build arguments for environment variables (optional)
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# Build the web application
WORKDIR /app/packages/web
RUN pnpm build

# Stage 3: Production with nginx
FROM nginx:alpine AS runner

# Copy custom nginx configuration
COPY packages/web/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static files
COPY --from=builder /app/packages/web/dist /usr/share/nginx/html

# Create non-root user for security (optional, nginx runs as nginx user by default)
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
