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

# Step 5: Install dependencies
RUN npm install

# Step 6: Install TypeScript globally
RUN npm install -g typescript

# Step 7: Install ts-node globally (for running TypeScript files directly)
RUN npm install -g ts-node

# Step 8: Copy the Prisma schema first
COPY prisma ./prisma/

# Step 9: Generate Prisma client
RUN npx prisma generate

# Step 10: Copy the rest of the application files
COPY . .

# Step 11: Expose the port your app will run on (e.g., 5500)
EXPOSE 5500

# Step 11: Run the application using `npm run dev`
CMD ["npm", "run", "dev"]
