#!/usr/bin/env bash

set -o nounset \
    -o errexit \
    -o verbose \
    -o xtrace

DOCKER_COMPOSE_FILE="docker-compose.yml"

docker-compose -f "$DOCKER_COMPOSE_FILE" down

docker-compose -f "$DOCKER_COMPOSE_FILE" --env-file .env.production.local build

docker-compose -f "$DOCKER_COMPOSE_FILE" --env-file .env.production.local up -d