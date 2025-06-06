FROM node:latest

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./

RUN npm install -g pnpm@10.7.0 && pnpm install

COPY . .

# Build TypeScript code with Vite
RUN pnpm build

# Expose port (assuming 3000, adjust if needed)
EXPOSE 5000

# Start the service
CMD ["pnpm", "start"]
