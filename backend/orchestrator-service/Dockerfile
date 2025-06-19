# Base image
FROM node:20

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the code
COPY . .

# Expose the orchestrator port
EXPOSE 5010

# Start the server
CMD ["node", "src/index.js"]
