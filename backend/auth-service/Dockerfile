# ---- base image with build tools ----
    FROM node:18-bullseye

    # Προσθήκη εργαλείων για native modules (όπως bcrypt)
    RUN apt-get update && apt-get install -y python3 g++ make && rm -rf /var/lib/apt/lists/*
    
    WORKDIR /app
    
    # Αντιγραφή dependencies
    COPY package*.json ./
    
    # Εγκατάσταση των εξαρτήσεων (axios, bcrypt, κλπ)
    RUN npm install --omit=dev
    
    # Αντιγραφή του υπόλοιπου app
    COPY . .
    
    # Ρυθμίσεις περιβάλλοντος
    ENV NODE_ENV=production
    ENV PORT=5001
    EXPOSE 5001
    
    CMD ["node", "src/index.js"]
    