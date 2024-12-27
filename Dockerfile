FROM node@sha256:0e5b53891ddbf3c4924077990f037ff55d981d030648345574cd1cb0e4a524bb AS base

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
