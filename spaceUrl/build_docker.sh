#!/bin/bash

docker build -t "space_url" .
docker run -d -p 7494:7494 --name space_url_container "space_url"
echo "Conteneur lancé"
exit 0