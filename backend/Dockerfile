FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./
 

# Copy the rest of the application code
COPY . .

 

# Command to run the application
CMD ["node", "--experimental-json-modules", "src/index.js"]