# Base image for Node.js
FROM node:22.14.0-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files (for reference, but don't install yet)
RUN npm -g install vite
COPY . .

# Note: Dependencies will be mounted from local node_modules via volume
# This keeps the image size minimal for development


# Expose the Vite dev server port
EXPOSE 3000

# Command to start the Vite dev server
CMD ["vite"]
