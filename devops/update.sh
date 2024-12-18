#!/bin/bash
set -e

cd /root/src/fightforms

git reset --hard
git fetch
git checkout main
git pull