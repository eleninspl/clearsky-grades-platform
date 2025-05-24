# Base image
FROM node:18

# Ορισμός working directory
WORKDIR /app

# Αντιγραφή των package.json & package-lock.json
COPY package*.json ./

# Εγκατάσταση εξαρτήσεων (axios, react, vite κ.λπ.)
RUN npm install

# Αντιγραφή όλου του υπόλοιπου κώδικα
COPY . .

# Άνοιγμα πόρτας (Vite default port)
EXPOSE 5173

# Εκκίνηση dev server
CMD ["npm", "run", "dev"]
