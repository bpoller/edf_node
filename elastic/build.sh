#!/bin/bash
docker build --rm -t bpoller/es .

docker run -v $(pwd)/plugins:/usr/share/elasticsearch/plugins bpoller/es plugin -i lmenezes/elasticsearch-kopf/1.4.3
