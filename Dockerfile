# syntax=docker/dockerfile:1

FROM node:22-bookworm-slim AS base

WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS dependencies
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* values are compiled into the browser bundle at build time.
ARG NEXT_PUBLIC_API_BASE_URL=/
ARG NEXT_PUBLIC_API_MOCKING=disabled
ARG NEXT_PUBLIC_KAKAO_CLIENT_ID=
ARG NEXT_PUBLIC_KAKAO_REDIRECT_URI=
ARG NEXT_PUBLIC_SENTRY_DSN=
ARG NEXT_PUBLIC_RELEASE=
ARG NEXT_PUBLIC_GA_ID=

ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL} \
    NEXT_PUBLIC_API_MOCKING=${NEXT_PUBLIC_API_MOCKING} \
    NEXT_PUBLIC_KAKAO_CLIENT_ID=${NEXT_PUBLIC_KAKAO_CLIENT_ID} \
    NEXT_PUBLIC_KAKAO_REDIRECT_URI=${NEXT_PUBLIC_KAKAO_REDIRECT_URI} \
    NEXT_PUBLIC_SENTRY_DSN=${NEXT_PUBLIC_SENTRY_DSN} \
    NEXT_PUBLIC_RELEASE=${NEXT_PUBLIC_RELEASE} \
    NEXT_PUBLIC_GA_ID=${NEXT_PUBLIC_GA_ID}

# SENTRY_AUTH_TOKEN은 소스맵 업로드에만 쓰이고 레이어에 남으면 안 되므로 BuildKit secret으로 주입
RUN --mount=type=secret,id=sentry_auth_token \
    SENTRY_AUTH_TOKEN="$(cat /run/secrets/sentry_auth_token 2>/dev/null || true)" npm run build

FROM base AS runner
ENV NODE_ENV=production \
    HOSTNAME=0.0.0.0 \
    PORT=3000

RUN mkdir -p .next/cache && chown -R node:node /app
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node
EXPOSE 3000
CMD ["node", "server.js"]
