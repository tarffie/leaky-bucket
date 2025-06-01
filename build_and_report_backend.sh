#!/bin/sh

docker build -f apps/backend/Dockerfile -t backend:latest . 2>&1 | tee docker_backend_log.txt

