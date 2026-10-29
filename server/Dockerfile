# syntax=docker/dockerfile:1

FROM oven/bun:1.4-alpine AS base
WORKDIR /app

# Install only production dependencies, then drop the Bun download cache.
FROM base AS deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production --omit=peer --omit=optional \
  && rm -rf /root/.bun/install/cache

# Final image: runtime dependencies + app source only.
FROM base AS runtime
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY env.ts ./
COPY src ./src
COPY drizzle ./drizzle
USER bun
EXPOSE 3000
CMD ["bun", "src/index.ts"]
