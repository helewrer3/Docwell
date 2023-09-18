#!/usr/bin/env bash

set -o nounset \
    -o errexit \
    -o verbose \
    -o xtrace
    
DOCKER_COMPOSE_FILE="docker-compose.yml"
docker-compose -f "$DOCKER_COMPOSE_FILE" --env-file .env build
docker login -u $ACR_USERNAME -p $ACR_PASSWORD $ACR_USERNAME.azurecr.io
docker-compose -f "$DOCKER_COMPOSE_FILE" --env-file .env push