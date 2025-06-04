FROM node:20

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./

RUN npm install -g pnpm@10.7.0 && pnpm install

COPY . .

# Build TypeScript code with Vite
RUN pnpm run build

# Expose port (assuming 3000, adjust if needed)
EXPOSE 9000 

# Start the service
CMD ["pnpm", "start"]
