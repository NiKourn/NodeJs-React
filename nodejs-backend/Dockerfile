# Step 1: Use an official Node.js runtime as a parent image
FROM node:18

# Step 2: Set the working directory inside the container
WORKDIR /usr/src/app

# Step 3: Copy package.json and package-lock.json
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Install TypeScript globally
RUN npm install -g typescript

# Step 6: Install ts-node globally (for running TypeScript files directly)
RUN npm install -g ts-node

# Step 7: Install type declarations for Express and CORS (for TypeScript support)
RUN npm install --save-dev @types/express @types/cors

# Step 8: Copy the rest of the application files
COPY . .

# Step 9: Expose the port your app will run on (e.g., 5000)
EXPOSE 5500

# Step 10: Run the application using `npm run dev`
CMD ["npm", "run", "dev"]
