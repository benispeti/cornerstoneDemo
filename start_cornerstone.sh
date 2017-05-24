#!/bin/bash

# import environment configuration
. ../env.sh

sudo docker build -t=$CORNERSTONE_IMAGE github.com/digitallyseamless/docker-nodejs-bower-grunt

sudo docker run --name $CORNERSTONE_CONTAINER --rm \
    -v $(pwd):/app -w /app \
    $CORNERSTONE_IMAGE \
    sh -c "npm install; bower install; grunt"
