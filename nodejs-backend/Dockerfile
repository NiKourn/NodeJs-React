# Step 1: Use an official Node.js runtime as a parent image
FROM node:22-slim

# Step 2: Install required system dependencies for Prisma
RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Step 3: Set the working directory inside the container
WORKDIR /usr/src/app

# Step 4: Copy package.json and package-lock.json
COPY package*.json ./

# Step 5: Install TypeScript and ts-node globally (needed for runtime)
RUN npm install -g typescript ts-node

# Step 6: Copy the Prisma schema first
COPY prisma ./prisma/

# Note: Dependencies will be mounted from local node_modules via volume
# This keeps the image size minimal for development

# Step 7: Expose the port your app will run on (e.g., 5500)
EXPOSE 5500

# Step 8: Run the application using `npm run dev`
CMD ["npm", "run", "dev"]
