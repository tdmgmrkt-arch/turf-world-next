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

# Fix known Medusa v2 bug: admin build output path mismatch
# Build puts files in public/admin/, but start may look in .medusa/server/public/admin/
RUN if [ -d "public/admin" ] && [ ! -f ".medusa/server/public/admin/index.html" ]; then \
      mkdir -p .medusa/server/public && \
      cp -r public/admin .medusa/server/public/admin; \
    fi

EXPOSE 9000
CMD ["sh", "-c", "npx medusa db:migrate && npx medusa start"]
