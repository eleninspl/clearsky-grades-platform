# ---- base image with build tools ----
    FROM node:18-bullseye

    # Add OS-level deps needed for native modules like bcrypt
    RUN apt-get update && apt-get install -y python3 g++ make && rm -rf /var/lib/apt/lists/*
    
    WORKDIR /app
    RUN npm install axios
    # ---- deps layer ----
    COPY package*.json ./
    RUN npm ci --omit=dev
    
    # ---- app layer ----
    COPY . .
    
    # ---- runtime env ----
    ENV NODE_ENV=production
    ENV PORT=5001
    EXPOSE 5001
    
    CMD ["node", "src/index.js"]
    
    