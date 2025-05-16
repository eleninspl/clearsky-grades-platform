#FROM node:18
#WORKDIR /app
#COPY package*.json ./
#RUN npm install
#COPY . .
#CMD ["node", "src/index.js"]


# ---- base image -----------------------------------------------------------
    FROM node:18
    WORKDIR /app
    
    # ---- deps layer -----------------------------------------------------------
    COPY package*.json ./
    RUN npm ci --omit=dev
    
    # ---- app layer ------------------------------------------------------------
    COPY . .
    
    # ---- runtime env ----------------------------------------------------------
    ENV NODE_ENV=production
    ENV PORT=5001
    EXPOSE 5001
    
    CMD ["node", "src/index.js"]
    