FROM node:22-alpine

WORKDIR /usr/src/app

# Copy root package.json and package-lock.json
COPY package.json package-lock.json ./

# Copy workspace package.json
COPY react-frontend/package.json ./react-frontend/

# Install all dependencies (shared + workspace)
RUN npm install

# Copy the rest of the frontend source
COPY react-frontend ./react-frontend/

WORKDIR /usr/src/app/react-frontend

EXPOSE 3100
CMD ["npm", "run", "dev"]