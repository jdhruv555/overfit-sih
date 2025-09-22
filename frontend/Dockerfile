# Use a Node.js base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first
# This caches dependencies and speeds up subsequent builds
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Make the dev server reachable
ENV HOST=0.0.0.0
EXPOSE 3000

# Use npm start which will invoke react-scripts start
CMD ["npm", "start"]
