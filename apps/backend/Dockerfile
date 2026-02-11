FROM node:20-alpine

WORKDIR /app

# Copy backend package files
COPY package.json ./

# Install ALL dependencies (TypeScript needed for build)
RUN npm install

# Copy backend source
COPY . .

# Build Medusa
RUN npm run build

# Remove devDependencies after build (smaller production image)
RUN npm prune --omit=dev

EXPOSE 9000

CMD ["npm", "start"]
