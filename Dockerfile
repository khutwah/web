FROM node@sha256:18379ee656cbc1d4d740ecd9da1c81c0609ce58d48fbe771e103bf6ad0028605 AS base

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
RUN npm run build
RUN echo 'const fs = require("fs"); process.env.DOTENV && fs.renameSync(process.env.DOTENV, ".env");' | cat - .next/standalone/server.js > temp.server.js && mv temp.server.js .next/standalone/server.js

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["server.js"]
