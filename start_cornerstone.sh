#!/bin/bash

CORNERSTONE_IMAGE="digitallyseamless/nodejs-bower-grunt"
CORNERSTONE_CONTAINER="rmc-cornerstone-demo"
CORNERSTONE_HOSTNAME="rmc.cornerstone.bioscreen.hu"
CORNERSTONE_PORT=9000

sudo docker build -t=$CORNERSTONE_IMAGE github.com/digitallyseamless/docker-nodejs-bower-grunt

sudo docker run --name $CORNERSTONE_CONTAINER --rm \
    --hostname $CORNERSTONE_HOSTNAME \
    --publish $CORNERSTONE_PORT:$CORNERSTONE_PORT \
    --restart unless-stopped \
    -v $(pwd):/app -w /app \
    $CORNERSTONE_IMAGE \
    sh -c "npm install; bower install; grunt serve" &
