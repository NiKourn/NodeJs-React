# Step 1: Use an official Node.js runtime as a parent image
FROM node:18

# Step 2: Set the working directory inside the container
WORKDIR /usr/src/app

# Step 3: Copy package.json and package-lock.json
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application files
COPY . .

# Step 6: Expose the port your app will run on (e.g., 5000)
EXPOSE 5000

# Step 7: Install ts-node globally (if you're using ts-node)
RUN npm install -g ts-node

# Step 8: Run the application using ts-node (for development)
CMD ["npm", "run", "dev"]
