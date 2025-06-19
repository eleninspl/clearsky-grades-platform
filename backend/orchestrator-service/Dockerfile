# ✅ Base image
FROM node:20

# ✅ Ορίζουμε το working directory στο app
WORKDIR /app

# ✅ Αντιγραφή package files πρώτα για καλύτερο caching
COPY package*.json ./

# ✅ Εγκατάσταση εξαρτήσεων
RUN npm install

# ✅ Αντιγραφή όλων των υπόλοιπων αρχείων
COPY . .

# ✅ Άνοιγμα port
EXPOSE 5010

# ✅ Εκκίνηση της εφαρμογής
CMD ["node", "src/index.js"]
