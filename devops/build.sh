#!/bin/bash
set -e

cd /root/src/fightforms

. ./devops/env.sh

docker rmi $IMAGE_TAG_ADMIN_PREV || true
docker tag $IMAGE_TAG_ADMIN $IMAGE_TAG_ADMIN_PREV || true
docker buildx build --file ./apps/admin/Dockerfile -t $IMAGE_TAG_ADMIN .

docker rmi $IMAGE_TAG_BACKEND_PREV || true
docker tag $IMAGE_TAG_BACKEND $IMAGE_TAG_BACKEND_PREV || true
docker buildx build --file ./apps/backend/Dockerfile -t $IMAGE_TAG_BACKEND .

docker rmi $IMAGE_TAG_FRONTEND_PREV || true
docker tag $IMAGE_TAG_FRONTEND $IMAGE_TAG_FRONTEND_PREV || true
docker buildx build --file ./apps/frontend/Dockerfile -t $IMAGE_TAG_FRONTEND .