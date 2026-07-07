#!/bin/bash

docker build -t seed_spy_image .
docker run -d --name seed_spy -p 127.0.0.1:8000:8000 --network bridge seed_spy_image
echo "Container lancé"