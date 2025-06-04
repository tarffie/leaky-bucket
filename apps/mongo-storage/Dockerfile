# Use official MongoDB image
FROM mongo:8.0.10-noble

# Metadata
LABEL maintainer="Emilia Alves <enbkraffe@gmail.com>"
LABEL description="MongoDB service for LeakyBucket monorepo storage"

# Set environment variables for MongoDB
ENV MONGO_INITDB_ROOT_USERNAME=admin
ENV MONGO_INITDB_ROOT_PASSWORD=securepassword
ENV MONGO_INITDB_DATABASE=app_db

# Expose MongoDB default port
EXPOSE 27017

# Create a volume for persistent data
VOLUME /data/db

# Copy initialization script
#COPY ./init-mongo.js /docker-entrypoint-initdb.d/

# Command to run MongoDB
CMD ["mongod"]
