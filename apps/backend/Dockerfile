FROM node:20-alpine

WORKDIR /app

# Build arg: admin frontend bakes this into JS at build time
ARG MEDUSA_BACKEND_URL=http://localhost:9000

# Copy workspace config and lockfile (for fast installs)
COPY package.json package-lock.json ./
COPY apps/backend/package.json ./apps/backend/

# Create stub storefront package.json so workspace glob resolves
RUN mkdir -p apps/storefront && \
    echo '{"name":"@turf-world/storefront","version":"0.0.1","private":true}' > apps/storefront/package.json

# Install only backend workspace deps (lockfile = fast resolution)
RUN npm install --workspace=@turf-world/backend --include-workspace-root --no-audit --no-fund

# Copy backend source only
COPY apps/backend/ ./apps/backend/

# Build Medusa (backend + admin frontend)
WORKDIR /app/apps/backend
ENV MEDUSA_BACKEND_URL=$MEDUSA_BACKEND_URL
RUN npx medusa build

# Debug: show where admin build files ended up (visible in Railway build logs)
RUN echo "=== All index.html files ===" && \
    find /app -name "index.html" 2>/dev/null || true && \
    echo "=== public/admin/ ===" && \
    ls -la public/admin/ 2>/dev/null || echo "NOT FOUND" && \
    echo "=== .medusa/server/public/admin/ ===" && \
    ls -la .medusa/server/public/admin/ 2>/dev/null || echo "NOT FOUND" && \
    echo "=== .medusa/admin/ ===" && \
    ls -la .medusa/admin/ 2>/dev/null || echo "NOT FOUND" && \
    echo "=== .medusa/server/ top-level ===" && \
    ls -la .medusa/server/ 2>/dev/null || echo "NOT FOUND"

# Copy admin build to all possible lookup paths
RUN ADMIN_HTML=$(find /app -name "index.html" -path "*/admin/*" -print -quit 2>/dev/null) && \
    if [ -n "$ADMIN_HTML" ]; then \
      ADMIN_DIR=$(dirname "$ADMIN_HTML") && \
      echo "Found admin build at: $ADMIN_DIR" && \
      mkdir -p public/admin && cp -rn "$ADMIN_DIR"/* public/admin/ 2>/dev/null || true && \
      mkdir -p .medusa/server/public/admin && cp -rn "$ADMIN_DIR"/* .medusa/server/public/admin/ 2>/dev/null || true; \
    else \
      echo "WARNING: No admin index.html found anywhere after medusa build"; \
    fi

EXPOSE 9000
CMD ["sh", "-c", "npx medusa db:migrate && npx medusa user -e office@turf-world.com -p Grassword26! || true && npx medusa start"]
