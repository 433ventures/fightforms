#!/bin/bash
set -e

cd /home/ec2-user/src/fghtfrms-hktn

. ./devops/env.sh

docker-compose up -d
docker rmi $IMAGE_TAG_BACKEND_PREV || true
docker rmi $IMAGE_TAG_FRONTEND_PREV || true
docker rmi $IMAGE_TAG_ADMIN_PREV || true