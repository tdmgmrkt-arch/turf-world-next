FROM node:20-alpine

WORKDIR /app

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

# Build Medusa
WORKDIR /app/apps/backend
RUN npx medusa build

EXPOSE 9000
CMD ["sh", "-c", "npx medusa db:migrate && npx medusa start"]
