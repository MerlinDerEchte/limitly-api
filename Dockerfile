# ---------- Base (shared) ----------
FROM node:22.19.0-alpine AS base
WORKDIR /usr/src/app

# ---------- Development ----------
FROM base AS dev
RUN apk add --no-cache libc6-compat
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start:dev"]

# ---------- Builder (production) ----------
FROM base AS builder
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---------- Production runtime ----------
FROM node:22.19.0-alpine AS prod
WORKDIR /usr/src/app

# Needed for pg_isready in entrypoint
RUN apk add --no-cache postgresql-client

# Only install production deps
COPY package*.json ./
RUN npm ci --omit=dev

# Bring in compiled dist (includes run-migrations.js)
COPY --from=builder /usr/src/app/dist ./dist
