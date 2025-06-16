FROM node:22-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy root package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./

# Copy backend and common package.json
COPY apps/server/package.json ./apps/server/package.json
COPY packages/common/package.json ./packages/common/package.json

# Install all dependencies (including devDependencies)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY apps/server ./apps/server
COPY packages/common ./packages/common

# Set working directory
WORKDIR /app/apps/server

# Command (overridden by docker-compose.yml for dev)
CMD ["pnpm", "dev"]
