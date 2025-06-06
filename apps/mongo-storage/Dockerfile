# Use official MongoDB image
FROM mongo:8.0.10-noble

# Metadata
LABEL maintainer="Emilia Alves <enbkraffe@gmail.com>"
LABEL description="MongoDB service for LeakyBucket monorepo storage"

# Expose MongoDB default port
EXPOSE 27017

# Create a volume for persistent data
VOLUME /data/db

# Copy initialization script
#COPY ./init-mongo.js /docker-entrypoint-initdb.d/

# Command to run MongoDB
CMD ["mongod"]
