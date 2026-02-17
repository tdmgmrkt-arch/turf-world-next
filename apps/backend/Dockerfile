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

# Copy backend source and product import data
COPY apps/backend/ ./apps/backend/
COPY products-data.json ./products-data.json

# Build Medusa (backend + admin frontend)
WORKDIR /app/apps/backend
ENV MEDUSA_BACKEND_URL=$MEDUSA_BACKEND_URL
RUN npx medusa build

# Fix Medusa v2 bug: admin build output path mismatch
# Build outputs to public/admin/ but start may look in .medusa/server/public/admin/
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
CMD ["sh", "-c", "npx medusa db:migrate && npx medusa exec ./src/scripts/import-all-products.ts || true && npx medusa exec ./src/scripts/fix-prices.ts || true && npx medusa exec ./src/scripts/fix-shipping-profiles.ts || true && npx medusa exec ./src/scripts/seed-shipping.ts || true && npx medusa exec ./src/scripts/fix-inventory.ts || true && npx medusa start"]
