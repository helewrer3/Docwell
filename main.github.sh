#!/usr/bin/env bash

set -o nounset \
    -o errexit \
    -o verbose \
    -o xtrace

touch .env
echo "DB_HOST=${{ env.DB_HOST }}" >> .env
echo "DB_DATABASE=${{ env.DB_DATABASE }}" >> .env
echo "DB_USER=${{ env.DB_USER }}" >> .env
echo "DB_PASSWORD=${{ secrets.DB_PASSWORD }}" >> .env
echo "DB_FIRST_USER=${{ env.DB_FIRST_USER }}" >> .env
echo "DB_FIRST_PASSWORD=${{ secrets.DB_FIRST_PASSWORD }}" >> .env
echo "DB_VOLUME=${{ env.DB_VOLUME }}" >> .env
echo "DB_PORT=${{ env.DB_PORT }}" >> .env
echo "SERVER_ENV=${{ env.SERVER_ENV }}" >> .env
echo "API_VOLUME=${{ env.API_VOLUME }}" >> .env
echo "SERVER_PORT=${{ env.SERVER_PORT }}" >> .env
echo "ACR_USERNAME=${{ env.ACR_USERNAME }}" >> .env
echo "ACR_PASSWORD=${{ secrets.ACR_PASSWORD }}" >> .env
echo "DOCWELL_REPORTS_STORAGE_CONNECTION_STRING=${{ secrets.DOCWELL_REPORTS_STORAGE_CONNECTION_STRING }}" >> .env

DOCKER_COMPOSE_FILE="docker-compose.yml"
docker-compose -f "$DOCKER_COMPOSE_FILE" build
docker login -u $ACR_USERNAME -p $ACR_PASSWORD $ACR_USERNAME.azurecr.io
docker-compose -f "$DOCKER_COMPOSE_FILE" push