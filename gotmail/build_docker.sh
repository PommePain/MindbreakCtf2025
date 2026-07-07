#!/bin/bash

docker build -t gotmail_image .
docker run --rm -p 4444:4444 --name gotmail_challenge --privileged gotmail_image
