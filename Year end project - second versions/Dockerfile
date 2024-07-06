# Adapted from https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile
# Install dependencies only when needed

# Rebuild the source code only when needed
FROM node:latest AS builder
RUN apt-get update
RUN apt-get install postgresql-client -y
WORKDIR /app
COPY . .
RUN npm install
CMD [ "sh", "entrypoint.sh" ]