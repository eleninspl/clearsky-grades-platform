FROM node:18

WORKDIR /app

# Αντιγραφή μόνο package files για εγκατάσταση εξαρτήσεων
COPY package*.json ./
RUN npm install

# ✅ Αντιγραφή ΟΛΩΝ των αρχείων
COPY . .

# Αν υπάρχει init script ή .env, μπαίνει αυτόματα

EXPOSE 5008

CMD ["node", "src/index.js"]