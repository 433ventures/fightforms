# Rebuild the source code only when needed
FROM node:20.10.0 AS builder

# install node modules
WORKDIR /opt/packages-src
COPY package.json /opt/packages-src/package.json
COPY apps/admin/package.json /opt/packages-src/apps/admin/package.json
COPY package-lock.json /opt/packages-src/package-lock.json

RUN npm ci

# build app
WORKDIR /opt/src
ENV NODE_OPTIONS="--max-old-space-size=2048"
ENV PUBLIC_URL "/admin"
COPY . .
RUN rm -rf ./node_modules && \
    rm -rf ./apps/frontend/node_modules && \
    rm -rf ./packages/graphql/node_modules && \
    cp -r /opt/packages-src/node_modules . && \
    cp -r /opt/packages-src/apps/admin/node_modules ./apps/admin && \
    npm run -w @fghtfrms-hktn/admin build

# Production image, copy all the files and run next
FROM nginx:stable-alpine
COPY --from=builder /opt/src/apps/admin/build /usr/share/nginx/html/admin
COPY --from=builder /opt/src/apps/admin/build /usr/share/nginx/html
COPY apps/admin/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]