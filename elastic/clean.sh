#!/bin/bash
echo "remove stopped containers"
docker rm $(docker ps -a | grep Exit | awk '{print $1}')

echo "remove untagged images"
docker rmi $(docker images | grep "^<none>" | awk '{print $3}')