# ==============================================================================
# Production Multi-Stage Dockerfile for Konfident Interview 2025
# ==============================================================================

# Build & Dependency Stage
FROM node:22-alpine AS dependencies
WORKDIR /app

RUN apk add --no-cache libc6-compat python3 make g++

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts && npm rebuild bcryptjs

# Production Runtime Stage
FROM node:22-alpine AS runner
WORKDIR /app

LABEL maintainer="Konfident Team" \
      version="1.0.0" \
      description="Konfident Interview Platform Production Image"

# Install dumb-init for proper signal forwarding and zombie process reaping
RUN apk add --no-cache dumb-init curl

ENV NODE_ENV=production \
    PORT=3000

# Non-root user for security compliance
USER node

# Copy dependencies and application source
COPY --chown=node:node --from=dependencies /app/node_modules ./node_modules
COPY --chown=node:node package.json ./
COPY --chown=node:node server.js ecosystem.config.js ./
COPY --chown=node:node src/ ./src/
COPY --chown=node:node public/ ./public/
COPY --chown=node:node views/ ./views/

EXPOSE 3000

# Docker Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -fsS http://localhost:3000/health || exit 1

# dumb-init handles PID 1 signal termination (SIGTERM, SIGINT) gracefully
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "server.js"]
