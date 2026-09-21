#!/bin/bash

source /etc/profile
source ~/.nvm/nvm.sh
nvm use v18.19.0
npm run build:pre

echo "Push to OSS."
# deploy to OSS
ossutil -c ~/.ossutilconfig cp -f -u --recursive ./dist/ oss://opscloud4-web-hz/cratos-pre/ --jobs 20 --meta Cache-Control:public,max-age=31536000,immutable --exclude "*.html"
ossutil -c ~/.ossutilconfig cp -f -u --recursive ./dist/cratos-web/index.html oss://opscloud4-web-hz/cratos-pre/cratos-web/index.html --meta Content-Type:text/html --meta Cache-Control:no-cache,no-store,must-revalidate
