#!/bin/bash
set -e

cd /home/ec2-user/src/fghtfrms-hktn

git reset --hard
git fetch
git checkout main
git pull