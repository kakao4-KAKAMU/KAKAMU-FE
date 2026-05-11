FROM node:22-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

FROM base AS builder
WORKDIR /app

# 빌드: docker build --build-arg env=<이름> (기본값 production → NODE_ENV·.env.production)
ARG env=production
ENV NODE_ENV=${env}
COPY . .

ENV CI=true
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @kakamu/client build-web

FROM base AS runner
ARG env=production
ENV NODE_ENV=${env}
WORKDIR /app/apps/client

ENV PORT=3000

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/apps/client/package.json ./package.json
COPY --from=builder /app/apps/client/server ./server
COPY --from=builder /app/apps/client/dist ./dist

EXPOSE 3000

CMD ["node", "./server/index.js"]
