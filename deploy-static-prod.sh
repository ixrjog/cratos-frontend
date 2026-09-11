#!/bin/bash

source /etc/profile
source ~/.nvm/nvm.sh
nvm use v18.19.0
npm run build:prod

echo "Push to prod OSS."
# ossutil -c ~/.ossutilconfig cp -f -u --recursive ./dist/ oss://opscloud4-web-hz/cratos-prod/


ossutil -c ~/.ossutilconfig cp -f -u --recursive ./dist/ oss://opscloud4-web-hz/cratos-prod/ --jobs 20 --meta Cache-Control:public,max-age=31536000,immutable --exclude "*.html"

ossutil -c ~/.ossutilconfig cp -f -u --recursive ./dist/cratos-web/index.html oss://opscloud4-web-hz/cratos-prod/cratos-web/index.html --meta Cache-Control:no-cache,no-store,must-revalidate
