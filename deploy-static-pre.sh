#!/bin/bash

source /etc/profile
source ~/.nvm/nvm.sh
nvm use v18.19.0
npm run build:prod

echo "Push to OSS."
# deploy to OSS
ossutil -c ~/.ossutilconfig cp -f -u --recursive ./dist/ oss://opscloud4-web-hz/cratos-pre/
