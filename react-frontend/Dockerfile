# Base image for Node.js
FROM node:22-slim

# Set working directory
WORKDIR /usr/src/app

# Copy package files (for reference, but don't install yet)
COPY package*.json ./

# Note: Dependencies will be mounted from local node_modules via volume
# This keeps the image size minimal for development

# Expose the frontend port
EXPOSE 3000

# Command to start the React app
CMD ["npm", "start"]
