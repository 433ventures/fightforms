#!/bin/bash
set -e

cd /root/src/fightforms

. ./devops/env.sh

docker compose -f ./docker-compose.deploy.yml up -d
docker rmi $IMAGE_TAG_BACKEND_PREV || true
docker rmi $IMAGE_TAG_FRONTEND_PREV || true
docker rmi $IMAGE_TAG_ADMIN_PREV || true