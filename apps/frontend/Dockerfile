# Rebuild the source code only when needed
FROM node:20.10.0 AS builder

# install node modules
WORKDIR /opt/packages-src
COPY package.json /opt/packages-src/package.json
COPY apps/frontend/package.json /opt/packages-src/apps/frontend/package.json
COPY package-lock.json /opt/packages-src/package-lock.json

RUN npm ci

# build app
WORKDIR /opt/src
ENV NODE_OPTIONS="--max-old-space-size=2048"
COPY . .
RUN rm -rf ./node_modules && \
    rm -rf ./apps/frontend/node_modules && \
    rm -rf ./packages/graphql/node_modules && \
    cp -r /opt/packages-src/node_modules . && \
    cp -r /opt/packages-src/apps/frontend/node_modules ./apps/frontend && \
    npm run -w @fghtfrms-hktn/frontend build

# Production image, copy all the files and run next
FROM node:20.10.0-alpine AS runner

WORKDIR /opt/src

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /opt/src/apps/frontend/.next .
COPY --from=builder /opt/src/apps/frontend/.next/static ./standalone/apps/frontend/.next/static
COPY --from=builder /opt/src/apps/frontend/public ./standalone/apps/frontend/public

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "./standalone/apps/frontend/server.js"]