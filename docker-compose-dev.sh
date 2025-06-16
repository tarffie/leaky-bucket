#!/bin/bash

# Check if at least one argument is provided
if [ $# -eq 0 ]; then
  echo "Error: Please provide the docker-compose.yml file path"
  exit 1
fi

# First argument is the Compose file
compose_file="$1"
shift # Remove the first argument, leaving the rest for Docker Compose commands

# List of environment files
env_files=(
  "apps/server/.env.backend.dev"
  "apps/storage/.env.storage.dev"
  "apps/mongo-storage/.env.database.dev"
  "apps/web/.env.client.dev"
)

# Build the command
command="docker compose"

# Add environment files if they exist
for env_file in "${env_files[@]}"; do
  if [ -f "$env_file" ]; then
    command="$command --env-file $env_file"
  else
    echo "Warning: Environment file $env_file not found, skipping"
  fi
done

# Add the Compose file
command="$command -f $compose_file"

# Add remaining arguments (e.g., up, down)
command="$command $@"

# Execute the command
$command
