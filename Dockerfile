# ─────────────────────────────────────────
# Stage 1: Builder
# ─────────────────────────────────────────
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files first (layer caching optimization)
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# ─────────────────────────────────────────
# Stage 2: Production Image
# ─────────────────────────────────────────
FROM node:18-alpine AS production

# Security: run as non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy installed node_modules from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy application source
COPY app/ ./app/
COPY package.json ./

# Set ownership to non-root user
RUN chown -R appuser:appgroup /app
USER appuser

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

# Start the application
CMD ["node", "app/index.js"]
