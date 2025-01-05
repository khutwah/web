# node:23.5.0-slim
# 05-01-2025
FROM node@sha256:7fdf54a2a5dc734af5b447021fdcc8c1c38a82c021a5c338efa0a38abb535a56 AS base

# Stage 1: Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json .npmrc ./
RUN npm ci

# Stage 2: Build the application
FROM base AS builder
ARG NEXT_PUBLIC_APP_VERSION
ARG NEXT_PUBLIC_CACHE_BUSTER
ENV NEXT_PUBLIC_APP_VERSION=$NEXT_PUBLIC_APP_VERSION
ENV NEXT_PUBLIC_CACHE_BUSTER=$NEXT_PUBLIC_CACHE_BUSTER
ENV DOCKER_BUILD=true
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN apt-get update -y && apt-get install -y openssl
RUN npm run prisma:gen
RUN npm run build
RUN echo 'const fs = require("fs"); process.env.DOTENV && fs.copyFileSync(process.env.DOTENV, ".env");' | cat - .next/standalone/server.js > temp.server.js && mv temp.server.js .next/standalone/server.js

FROM base AS runner
RUN apt-get update -y && apt-get install -y openssl
WORKDIR /app
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=1536 --no-warnings"
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["server.js"]
