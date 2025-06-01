# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and pnpm-lock.yaml from the monorepo root
COPY package.json pnpm-lock.yaml ./

# Copy the backend's package.json from apps/backend/
COPY apps/backend/package.json ./apps/backend/package.json

# Install pnpm and all dependencies (including devDependencies for build)
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy the entire monorepo source code
COPY . .


# Build the backend application
RUN pnpm --filter ./apps/backend run build

# Stage 2: Create the runtime image
FROM node:20-alpine AS runner

WORKDIR /app

# Install pnpm globally in the runner stage (optional, only if needed at runtime)
RUN npm install -g pnpm

# Copy only the necessary built artifacts and dependencies
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/package.json ./apps/backend/package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

# Set the working directory to the backend app
WORKDIR /app/apps/backend

# Command to run the application
CMD ["node", "dist/index.js"]
