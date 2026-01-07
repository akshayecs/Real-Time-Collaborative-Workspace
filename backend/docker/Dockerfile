# =========================
# 1️⃣ Build Stage
# =========================
FROM node:20-alpine AS builder

# Install Alpine-specific dependencies
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
# Generate Prisma client with the correct binary targets
RUN npx prisma generate

COPY . .
RUN npm run build

# =========================
# 2️⃣ Runtime Stage
# =========================
FROM node:20-alpine

# REQUIRED: Add these for Prisma to run on Alpine
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

ENV NODE_ENV=production

# These lines MUST reference 'builder' which is defined in line 4
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Re-run generate to link the binary to this specific stage
RUN npx prisma generate

EXPOSE 3000

CMD ["node", "dist/server.js"]