#!/bin/bash

source /etc/profile
source ~/.nvm/nvm.sh
nvm use v18.19.0
npm run build:prod


scp -r /Users/liangjian/Documents/workspace/baiyi/cratos-web/dist/cratos-web/* root@161.248.246.185:/opt/cratos-web/