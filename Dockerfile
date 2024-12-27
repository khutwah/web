FROM cgr.dev/chainguard/node@sha256:c7b054b1852e9b8bbb0821e4499734aff9cacbed88c9f20faa81299d0cca9c9a AS base

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
