# Base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy only package files first (for cache)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY ./src ./src

# Copy .env
COPY .env .env

# Expose port
EXPOSE 5004

# Start the service
CMD ["node", "src/index.js"]
