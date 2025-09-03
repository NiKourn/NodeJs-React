FROM node:22-slim

# Install required system dependencies for Prisma (SSL etc.)
RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*


WORKDIR /usr/src/app

# only copy source (node_modules will come from host volume)
COPY . .

EXPOSE 5500
CMD ["npm", "run", "dev"]
