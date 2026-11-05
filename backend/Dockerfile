FROM node:26-trixie

WORKDIR /app

# Copy shared package metadata
COPY shared/package.json shared/package-lock.json ./shared/

# Copy backend package metadata
COPY backend/package.json backend/package-lock.json ./backend/

# Install shared dependencies
WORKDIR /app/shared
RUN npm ci

# Install backend dependencies
WORKDIR /app/backend
RUN npm ci

# Copy source files
COPY shared/ /app/shared/src
COPY backend/ /app/backend/

# Generate Prisma client
RUN npx prisma generate

CMD ["node", "./src/index.ts"]
