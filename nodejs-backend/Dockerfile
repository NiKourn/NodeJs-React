FROM node:22-slim

# Install required system dependencies for Prisma (SSL etc.)
RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# Copy root package.json and package-lock.json
COPY package.json package-lock.json ./

# Copy workspace package.json
COPY nodejs-backend/package.json ./nodejs-backend/

# Install all dependencies (shared + workspace)
RUN npm install

# Copy the rest of the backend source
COPY nodejs-backend ./nodejs-backend/

WORKDIR /usr/src/app/nodejs-backend

EXPOSE 5500
CMD ["npm", "run", "dev"]
