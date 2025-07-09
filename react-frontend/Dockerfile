# Base image for Node.js
FROM node:22-slim

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the frontend port
EXPOSE 3000

# Command to start the React app
CMD ["npm", "start"]
