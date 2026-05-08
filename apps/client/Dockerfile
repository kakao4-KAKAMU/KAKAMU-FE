FROM node:22-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

FROM base AS builder
WORKDIR /app

COPY . .

ENV CI=true
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @kakamu/client build-web

FROM base AS runner
WORKDIR /app/apps/client

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/apps/client/package.json ./package.json
COPY --from=builder /app/apps/client/server ./server
COPY --from=builder /app/apps/client/dist ./dist

EXPOSE 3000

CMD ["node", "./server/index.js"]
