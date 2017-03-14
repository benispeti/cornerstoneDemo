#!/bin/bash

# import environment configuration
. ../env.config

sudo docker build -t=$CORNERSTONE_IMAGE github.com/digitallyseamless/docker-nodejs-bower-grunt

sudo docker run --name $CORNERSTONE_CONTAINER --rm \
    --hostname $CORNERSTONE_HOSTNAME \
    --publish $CORNERSTONE_PORT:$CORNERSTONE_PORT \
    --restart unless-stopped \
    -v $(pwd):/app -w /app \
    $CORNERSTONE_IMAGE \
    sh -c "npm install; bower install; grunt serve" &
