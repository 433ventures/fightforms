# Rebuild the source code only when needed
FROM node:20.10.0 AS builder

# install node modules
WORKDIR /opt/packages-src
COPY package.json /opt/packages-src/package.json
COPY apps/backend/package.json /opt/packages-src/apps/backend/package.json
COPY package-lock.json /opt/packages-src/package-lock.json

RUN npm ci

WORKDIR /opt/src
COPY . .
RUN rm -rf ./node_modules && \
    rm -rf ./apps/backend/node_modules && \
    cp -r /opt/packages-src/node_modules . && \
    cp -r /opt/packages-src/apps/backend/node_modules ./apps/backend && \
    npm run -w @fghtfrms-hktn/backend build && \
    npm prune --production


# ------- PRODUCTION
FROM node:20.10.0-alpine AS production

#shared data
WORKDIR /app
COPY --from=builder /opt/src/package.json ./package.json
COPY --from=builder /opt/src/node_modules ./node_modules
#COPY --from=builder /opt/src/packages ./packages

#backend data
COPY --from=builder /opt/src/apps/backend/package.json ./apps/backend/package.json
COPY --from=builder /opt/src/apps/backend/dist ./apps/backend/dist
COPY --from=builder /opt/src/apps/backend/node_modules ./apps/backend/node_modules
COPY --from=builder /opt/src/apps/backend/src/database ./apps/backend/src/database

#launch production build
CMD ["npm", "run", "-w", "@fghtfrms-hktn/backend" ,"start:prod"]

EXPOSE 3000
EXPOSE 3003