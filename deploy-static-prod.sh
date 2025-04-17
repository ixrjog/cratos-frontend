#!/bin/bash

. /etc/profile

nvm use v18.19.0
npm run build:prod

echo "Push to pre OSS."
# deploy to OSS
ossutil -c ~/.ossutilconfig cp -f -u --recursive ./dist/ oss://opscloud4-web-hz/cratos-pre/

echo "Push to prod OSS."
# deploy to OSS
ossutil -c ~/.ossutilconfig cp -f -u --recursive ./dist/ oss://opscloud4-web-hz/cratos-prod/
