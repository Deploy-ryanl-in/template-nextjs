FROM node:26.12.0-bookworm-slim@sha256:298992629d69bbd5b2b03ad57094d8e4fcb3a8eeb7c4e25d29de656519568913 AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
FROM node:26.12.0-bookworm-slim@sha256:298992629d69bbd5b2b03ad57094d8e4fcb3a8eeb7c4e25d29de656519568913 AS build
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_APP_LABEL=Personal-PaaS
ENV NEXT_PUBLIC_APP_LABEL=$NEXT_PUBLIC_APP_LABEL NEXT_TELEMETRY_DISABLED=1
RUN npm run build
FROM node:26.12.0-bookworm-slim@sha256:298992629d69bbd5b2b03ad57094d8e4fcb3a8eeb7c4e25d29de656519568913 AS runtime
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 HOSTNAME=0.0.0.0 PORT=3000 NODE_OPTIONS=--max-old-space-size=160
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
COPY cache-handler.cjs docker-entrypoint.sh ./
RUN mkdir -p .next/cache && rm -rf .next/cache/images && ln -s /tmp/next-image-cache .next/cache/images && chmod 755 docker-entrypoint.sh
USER 10001:10001
EXPOSE 3000
ENTRYPOINT ["/app/docker-entrypoint.sh"]
