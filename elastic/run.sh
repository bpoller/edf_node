#!/bin/bash
docker run \
--restart=always \
-d \
-p 9200:9200 \
-p 9300:9300 \
-v $(pwd)/data:/usr/share/elasticsearch/data \
-v $(pwd)/config:/usr/share/elasticsearch/config \
-v $(pwd)/plugins:/usr/share/elasticsearch/plugins \
--name bpoller_es \
bpoller/es
