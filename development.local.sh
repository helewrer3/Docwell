#!/usr/bin/env bash

set -o nounset \
    -o errexit \
    -o verbose \
    -o xtrace

DOCKER_COMPOSE_FILE="docker-compose.local.yml"
docker-compose -f "$DOCKER_COMPOSE_FILE" --env-file .env.development.local down
docker-compose -f "$DOCKER_COMPOSE_FILE" --env-file .env.development.local build
docker-compose -f "$DOCKER_COMPOSE_FILE" --env-file .env.development.local up