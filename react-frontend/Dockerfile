FROM node:22-alpine

WORKDIR /usr/src/app

# only copy package.json first to leverage Docker cache
COPY react-frontend/package*.json ./

# install deps inside container (Linux-native)
RUN npm install

# copy the rest of the frontend source
COPY react-frontend ./

EXPOSE 3000
CMD ["npm", "run", "dev"]
